import * as wm from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';

async function fetchText(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`Failed to fetch ${url}: ${r.status}`);
    return await r.text();
}


function parseMtl(text) {
    const materials = {};
    let current = null;
    const lines = text.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;
        const parts = line.split(/\s+/);
        if (parts[0] === 'newmtl') {
            current = parts[1];
            materials[current] = { Kd: [0.8, 0.6, 0.4] };
        } else if (parts[0] === 'Kd' && current) {
            materials[current].Kd = parts.slice(1, 4).map(Number);
        }
    }
    return materials;
}

function parseOBJ(text, materials = {}) {
    const posArray = [];
    const normArray = [];
    const vertices = [];
    const indices = [];
    const vertMap = new Map();

    let currentMaterial = null;

    function pushVertex(pIdx, nIdx) {
        const key = pIdx + '/' + nIdx + '/' + (currentMaterial || '');
        if (vertMap.has(key)) return vertMap.get(key);
        const p = posArray[pIdx - 1];
        const n = nIdx ? normArray[nIdx - 1] : [0, 0, 1];
        const color = currentMaterial && materials[currentMaterial] && materials[currentMaterial].Kd
            ? materials[currentMaterial].Kd
            : [0.8, 0.6, 0.4];
        // index before push
        const idx = vertices.length / 9;
        // store pos(3) normal(3) color(3)
        vertices.push(p[0], p[1], p[2], n[0], n[1], n[2], color[0], color[1], color[2]);
        vertMap.set(key, idx);
        return idx;
    }

    const lines = text.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;
        const parts = line.split(/\s+/);
        if (parts[0] === 'v') {
            posArray.push(parts.slice(1).map(Number));
        } else if (parts[0] === 'vn') {
            normArray.push(parts.slice(1).map(Number));
        } else if (parts[0] === 'usemtl') {
            currentMaterial = parts[1];
        } else if (parts[0] === 'f') {
            const face = parts.slice(1).map(p => {
                const comps = p.split('/');
                const v = parseInt(comps[0], 10);
                const vn = comps.length >= 3 && comps[2] ? parseInt(comps[2], 10) : undefined;
                return { v, vn };
            });
            // triangulate (assume convex polygon)
            for (let i = 1; i + 1 < face.length; ++i) {
                const a = face[0];
                const b = face[i];
                const c = face[i + 1];
                indices.push(pushVertex(a.v, a.vn));
                indices.push(pushVertex(b.v, b.vn));
                indices.push(pushVertex(c.v, c.vn));
            }
        }
    }

    return {
        vertexData: new Float32Array(vertices),
        indexData: indices.length > 65535 ? new Uint32Array(indices) : new Uint16Array(indices),
        vertexCount: vertices.length / 9,
        indexCount: indices.length,
    };
}

function makeCube() {
    // simple cube (positions + normals + color)
    const color = [0.8, 0.6, 0.4];
    const p = [
        // front
        -1, -1, 1, 0, 0, 1, color[0], color[1], color[2],
        1, -1, 1, 0, 0, 1, color[0], color[1], color[2],
        1, 1, 1, 0, 0, 1, color[0], color[1], color[2],
        -1, 1, 1, 0, 0, 1, color[0], color[1], color[2],
        // back
        -1, -1, -1, 0, 0, -1, color[0], color[1], color[2],
        -1, 1, -1, 0, 0, -1, color[0], color[1], color[2],
        1, 1, -1, 0, 0, -1, color[0], color[1], color[2],
        1, -1, -1, 0, 0, -1, color[0], color[1], color[2],
    ];
    const idx = [
        0, 1, 2, 0, 2, 3,
        4, 5, 6, 4, 6, 7,
        0, 3, 5, 0, 5, 4,
        1, 7, 6, 1, 6, 2,
        3, 2, 6, 3, 6, 5,
        0, 4, 7, 0, 7, 1,
    ];
    return {
        vertexData: new Float32Array(p),
        indexData: new Uint16Array(idx),
        indexCount: idx.length,
    };
}

function computeBounds(geometry) {
    const v = geometry.vertexData;
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    for (let i = 0; i < v.length; i += 9) {
        const x = v[i + 0], y = v[i + 1], z = v[i + 2];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (z < minZ) minZ = z;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
        if (z > maxZ) maxZ = z;
    }

    const center = [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2];
    const maxDim = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1e-6);
    const scale = (2.0 / maxDim) * 1.2;

    return { center, scale };
}

async function main() {
    // ---- CHECK SUPPORT ----
    console.log("Checking for support, hardware and adapter.");
    if (!navigator.gpu) {
        throw new Error("WebGPU not supported by your browser.");
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
        throw new Error("WebGPU Supported but not appropriate hardware.");
    }
    const device = await adapter.requestDevice();
    if (!device) {
        throw new Error("Error supporting WebGPU in your browser");
    }

    // ---- CONTEXT ----
    console.log("Getting the WebGPU context from our canvas element and configuring it.");
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('webgpu');
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
        device,
        format: canvasFormat,
    });

    // ---- SHADERS ----
    const shaderCode = `
        struct VertexOut {
            @builtin(position) Position : vec4<f32>,
            @location(0) normal : vec3<f32>,
            @location(1) color : vec3<f32>,
        };

        @vertex
        fn vs_main(@location(0) position : vec3<f32>, @location(1) normal : vec3<f32>, @location(2) color : vec3<f32>) -> VertexOut {
            var out : VertexOut;
            out.Position = vec4<f32>(position, 1.0);
            out.normal = normalize(normal);
            out.color = color;
            return out;
        }

        @fragment
        fn fs_main(in : VertexOut) -> @location(0) vec4<f32> {
            let lightDir = normalize(vec3<f32>(0.5, 0.8, 0.6));
            let diff = max(dot(in.normal, lightDir), 0.0);
            return vec4<f32>(in.color * (0.2 + 0.8 * diff), 1.0);
        }
    `;

    const module = device.createShaderModule({
        label: 'Simple Shader',
        code: shaderCode
    });

    // ---- PIPELINE ----
    const pipeline = device.createRenderPipeline({
        label: 'Model pipeline',
        layout: 'auto',
        vertex: {
            module,
            entryPoint: 'vs_main',
            buffers: [{
                arrayStride: 36, // pos(3) + normal(3) + color(3)
                attributes: [
                    { shaderLocation: 0, offset: 0, format: 'float32x3' },
                    { shaderLocation: 1, offset: 12, format: 'float32x3' },
                    { shaderLocation: 2, offset: 24, format: 'float32x3' },
                ],
            }],
        },
        fragment: {
            module,
            entryPoint: 'fs_main',
            targets: [{ format: canvasFormat }],
        },
        depthStencil: {
            format: 'depth24plus',
            depthWriteEnabled: true,
            depthCompare: 'less',
        },
        primitive: {
            topology: 'triangle-list',
            cullMode: 'none',
        },
    });

    // ---- LOAD GEOMETRY ----
    let geometry;
    try {
        const objText = await fetchText('meshes/model.obj');
        // find mtllib references and load materials
        const materials = {};
        const lines = objText.split('\n');
        const mtlfiles = [];
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('mtllib')) {
                const parts = line.split(/\s+/).slice(1);
                for (const p of parts) mtlfiles.push(p);
            }
        }
        for (const m of mtlfiles) {
            try {
                const mtext = await fetchText(m);
                Object.assign(materials, parseMtl(mtext));
            } catch (e) {
                try {
                    const mtext = await fetchText('meshes/' + m);
                    Object.assign(materials, parseMtl(mtext));
                } catch (e2) {
                    // ignore missing mtl
                    console.warn('Could not load mtl', m);
                }
            }
        }

        geometry = parseOBJ(objText, materials);
        if (geometry.indexCount === 0) throw new Error('OBJ had no indices');
        console.log('Loaded meshes/model.obj');
    } catch (e) {
        console.warn('Failed to load OBJ, using fallback cube.', e);
        geometry = makeCube();
    }

    const { center: modelCenter, scale } = computeBounds(geometry);

    // ---- BUFFERS ----
    const vertexBuffer = device.createBuffer({
        size: geometry.vertexData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: false,
    });
    device.queue.writeBuffer(vertexBuffer, 0, geometry.vertexData);

    const indexBuffer = device.createBuffer({
        size: geometry.indexData.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: false,
    });
    device.queue.writeBuffer(indexBuffer, 0, geometry.indexData);

    const originalVertexData = geometry.vertexData.slice();
    const workingVertexData = new Float32Array(originalVertexData.length);

    // ---- RENDER PASS DESCRIPTOR ----
    const renderPassDescriptor = {
        label: 'Main render pass',
        colorAttachments: [{
            clearValue: [0.2, 0.2, 0.25, 1.0],
            loadOp: 'clear',
            storeOp: 'store',
        }],
    };

    let depthTexture = null;
    function createDepthTexture() {
        if (depthTexture) depthTexture.destroy?.();
        depthTexture = device.createTexture({
            size: { width: canvas.width, height: canvas.height },
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
    }

    function render() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width * dpr));
        const height = Math.max(1, Math.floor(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            createDepthTexture();
        }

        // Compute matrices and transform vertices
        const aspect = canvas.width / canvas.height;
        const fov = 35 * Math.PI / 180;
        const proj = wm.mat4.perspective(fov, aspect, 0.1, 100.0);
        const view = wm.mat4.lookAt([-4, 3, 3], [0, 0, 0], [0, 1, 0]);
        const vp = wm.mat4.multiply(proj, view);

        for (let i = 0; i < originalVertexData.length; i += 9) {
            const px = (originalVertexData[i + 0] - modelCenter[0]) * scale;
            const py = (originalVertexData[i + 1] - modelCenter[1]) * scale;
            const pz = (originalVertexData[i + 2] - modelCenter[2]) * scale;

            const x4 = px * vp[0] + py * vp[4] + pz * vp[8] + vp[12];
            const y4 = px * vp[1] + py * vp[5] + pz * vp[9] + vp[13];
            const z4 = px * vp[2] + py * vp[6] + pz * vp[10] + vp[14];
            const w4 = px * vp[3] + py * vp[7] + pz * vp[11] + vp[15];

            const invW = 1.0 / w4;
            workingVertexData[i + 0] = x4 * invW;
            workingVertexData[i + 1] = y4 * invW;
            workingVertexData[i + 2] = z4 * invW;
            // copy normals
            workingVertexData[i + 3] = originalVertexData[i + 3];
            workingVertexData[i + 4] = originalVertexData[i + 4];
            workingVertexData[i + 5] = originalVertexData[i + 5];
            // copy color
            workingVertexData[i + 6] = originalVertexData[i + 6];
            workingVertexData[i + 7] = originalVertexData[i + 7];
            workingVertexData[i + 8] = originalVertexData[i + 8];
        }

        device.queue.writeBuffer(vertexBuffer, 0, workingVertexData);

        renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
        renderPassDescriptor.depthStencilAttachment = depthTexture ? {
            view: depthTexture.createView(),
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        } : undefined;

        const encoder = device.createCommandEncoder({ label: 'the encoder' });
        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(pipeline);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.setIndexBuffer(indexBuffer, geometry.indexData instanceof Uint32Array ? 'uint32' : 'uint16');
        pass.drawIndexed(geometry.indexCount);
        pass.end();
        device.queue.submit([encoder.finish()]);

        requestAnimationFrame(render);
    }

    createDepthTexture();
    requestAnimationFrame(render);
}

main().catch(e => console.error(e));
