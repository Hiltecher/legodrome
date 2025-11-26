// importing wgpu-matrix library for matrix math operations
import * as wm from 'https://wgpu-matrix.org/dist/3.x/wgpu-matrix.module.js';

// Importing the camera module for navigating around the diorama
import { Camera } from './camera.js';

// helper function to read text from files, used to read and load shaders, obj and mtl files 
async function readFile(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text;
}

// hardcoding all material and definitions for faster load times from Racecar and Legodrome mtl files
const MATERIALS = {
    // Legodrome materials
    'Asphalt': { Kd: [0.8, 0.6, 0.4], map_Kd: 'asphalt.png' },
    'Bollard_Orange': { Kd: [0.800119, 0.258554, 0.000000], map_Kd: null },
    'Concrete': { Kd: [0.8, 0.6, 0.4], map_Kd: 'Concrete032_1K-JPG_Color.jpg' },
    'Emirates': { Kd: [0.8, 0.6, 0.4], map_Kd: 'emirates.png' },
    'Flash_Yellow': { Kd: [0.744446, 0.800197, 0.000000], map_Kd: null, glow: true },
    'Flash_Yellow.001': { Kd: [0.744446, 0.800197, 0.000000], map_Kd: null, glow: true },
    'Grandstand_Grey': { Kd: [0.632091, 0.606932, 0.625752], map_Kd: null },
    'Grandstand_White': { Kd: [1.000000, 0.971443, 0.971443], map_Kd: null },
    'Grass.002': { Kd: [0.800000, 0.800000, 0.800000], map_Kd: 'grass.png' },
    'GreenArm': { Kd: [0.800000, 0.800000, 0.800000], map_Kd: 'GreenArm.png' },
    'GreenArm.001': { Kd: [0.800000, 0.800000, 0.800000], map_Kd: 'GreenArm.png' },
    'GreenArm.002': { Kd: [0.800000, 0.800000, 0.800000], map_Kd: 'PurpleArm.png' },
    'GreenArm.003': { Kd: [0.800000, 0.800000, 0.800000], map_Kd: 'PurpleArm.png' },
    'Kerb1.001': { Kd: [0.800071, 0.019096, 0.030550], map_Kd: null },
    'Kerb2.001': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Material.001': { Kd: [0.533274, 0.005181, 0.005182], map_Kd: null },
    'Material.002': { Kd: [0.800000, 0.800000, 0.800000], map_Kd: 'Material.002.png' },
    'Material.003': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.004': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.005': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.012': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Material.013': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.014': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Material.016': { Kd: [0.8, 0.6, 0.4], map_Kd: 'ArmBlue_1.png' },
    'Material.017': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.018': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.019': { Kd: [0.542446, 0.542446, 0.542446], map_Kd: null },
    'Material.030': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Material.032': { Kd: [0.000000, 0.000000, 0.000000], map_Kd: null },
    'Material.034': { Kd: [1.000000, 0.000000, 0.000896], map_Kd: null },
    'Material.036': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.037': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Material.038': { Kd: [0.533274, 0.005181, 0.005182], map_Kd: null },
    'Material.040': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.041': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.042': { Kd: [0.800000, 0.800000, 0.800000], map_Kd: null },
    'Material.044': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.045': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.046': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.047': { Kd: [0.8, 0.6, 0.4], map_Kd: 'ArmBlue_1.png' },
    'Material.049': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.050': { Kd: [0.000000, 0.155149, 0.013172], map_Kd: null },
    'Material.052': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.053': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.054': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.056': { Kd: [0.230321, 0.000000, 0.497512], map_Kd: 'PurpleArm.png' },
    'Material.058': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.059': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.060': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.061': { Kd: [0.000000, 0.155149, 0.013172], map_Kd: null },
    'Material.063': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.064': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.065': { Kd: [0.230321, 0.000000, 0.497512], map_Kd: 'PurpleArm.png' },
    'Material.067': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Material.068': { Kd: [0.033105, 0.033105, 0.033105], map_Kd: null },
    'Metal': { Kd: [0.8, 0.6, 0.4], map_Kd: 'DiamondPlate009_1K-JPG_Color.jpg' },
    'Phone_White': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Phone_White.001': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Phone_White.002': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Phone_White.003': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Rolex': { Kd: [0.8, 0.6, 0.4], map_Kd: 'rolex.png' },
    'SVGMat.004': { Kd: [0.000000, 0.000000, 0.000000], map_Kd: null },
    'Shirt_blue': { Kd: [0.000000, 0.168269, 0.533277], map_Kd: null },
    'Shirt_blue.001': { Kd: [0.000000, 0.168269, 0.533277], map_Kd: null },
    'Stand_Sign': { Kd: [0.8, 0.6, 0.4], map_Kd: 'sign_1.png' },
    'TV_Plastic': { Kd: [0.8, 0.6, 0.4], map_Kd: 'Plastic012A_1K-JPG_Color.jpg' },
    'TV_Plastic.001': { Kd: [0.8, 0.6, 0.4], map_Kd: 'Plastic012A_1K-JPG_Color.jpg' },
    'TV_Plastic.002': { Kd: [0.8, 0.6, 0.4], map_Kd: 'Plastic012A_1K-JPG_Color.jpg' },
    'TV_Screen': { Kd: [0.8, 0.6, 0.4], map_Kd: 'sign.png', glow: true },
    'Tarmac': { Kd: [0.8, 0.6, 0.4], map_Kd: 'Asphalt025C_1K-JPG_Color.jpg' },
    'Void': { Kd: [0.000000, 0.000000, 0.000000], map_Kd: null },
    'WhiteLine.001': { Kd: [0.800000, 0.800000, 0.800000], map_Kd: null },
    'face_02': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: 'FACE.002.png' },
    'face_04': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: 'FACE.004.png' },
    'face_07': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: 'FACE.007.png' },
    'face_08': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: 'FACE.008.png' },
    'face_10': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: 'FACE.010.png' },
    'face_11': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: 'FACE.011.png' },
    'face_3': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: 'FACE.003.png' },
    'face_9': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: 'FACE.009.png' },
    'Grass-asphalt': { Kd: [0.8, 0.6, 0.4], map_Kd: 'grass-asphalt.png' },

    // Racecar materials
    'Black': { Kd: [0.000000, 0.000000, 0.000000], map_Kd: null },
    'Faces.001': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: null },
    'Helmet.001': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: 'helmet-mat.png' },
    'Material.002': { Kd: [1.000000, 1.000000, 1.000000], map_Kd: 'f1-car-mat.png' },
    'Material.021': { Kd: [0.018604, 0.018604, 0.018604], map_Kd: null },
    'Material.022': { Kd: [0.654297, 0.015762, 0.013176], map_Kd: null },
    'Material.023': { Kd: [0.000000, 0.000000, 0.000000], map_Kd: null },
    'Material.024': { Kd: [0.000000, 0.000000, 0.000000], map_Kd: null },
    'Material.025': { Kd: [0.005239, 0.005239, 0.005239], map_Kd: null },
    'Material.026': { Kd: [0.000000, 0.000000, 0.000000], map_Kd: null },
    'Material.027': { Kd: [0.005239, 0.005239, 0.005239], map_Kd: null },
    'Material.028': { Kd: [0.005239, 0.005239, 0.005239], map_Kd: null },
    'Material.029': { Kd: [0.000000, 0.000000, 0.000000], map_Kd: null },
    'Material.031': { Kd: [0.799098, 0.799104, 0.000000], map_Kd: null },
    'Material.033': { Kd: [0.533274, 0.005181, 0.005182], map_Kd: null },
    'Material.035': { Kd: [0.005239, 0.005239, 0.005239], map_Kd: null },
    'Red': { Kd: [0.822782, 0.013702, 0.016807], map_Kd: null },
    'Tyre.006': { Kd: [0.8, 0.6, 0.4], map_Kd: 'tyre-mat.png' },
    'Tyre.007': { Kd: [0.8, 0.6, 0.4], map_Kd: 'tyre-mat.png' },
    'Tyre.008': { Kd: [0.8, 0.6, 0.4], map_Kd: 'tyre-mat.png' },
    'Tyre.009': { Kd: [0.8, 0.6, 0.4], map_Kd: 'tyre-mat.png' },

};

// helper function to parse obj files into submushes by grouping faces by material
// hecessary due to large obj files with 10k+ lego pieces
function parseOBJ(text) {
    // storing vertex data in format of arrays 
    const positions = [];
    const normals = [];
    const uvs = [];
    const submeshes = new Map();  // mapping material names to mesh data
    let currentMaterial = '';     // keeping track of materials already added

    // helper function to get submesh for the material or create one if it doesn't exist
    function getSubmesh(name) {
        // if for given material submesh doesnt exist, create one
        if (!submeshes.has(name)) {
            // creating new submesh with mesh data arrays and cache to avoid duplicate vertices
            submeshes.set(name, { vertices: [], indices: [], cache: new Map() });
        }
        // return the submesh for the material
        return submeshes.get(name);
    }

    // helper function to add a vertex to the mesh and return its index, takes position, uv and normal indices as parameters
    function addVertex(mesh, pIdx, uvIdx, nIdx) {
        // using a unique key for each vertex combination to avoid duplicates
        const key = `${pIdx}/${uvIdx || ''}/${nIdx || ''}`; // Key for caching vertices

        // return existing vertex index if it is already added
        if (mesh.cache.has(key)) return mesh.cache.get(key);

        // get actual vertex data from the indicies
        const position = positions[pIdx - 1];
        const normal = nIdx ? normals[nIdx - 1] : [0, 0, 1];    // default normal if not specified
        const uv = uvIdx ? uvs[uvIdx - 1] : [0, 0];             // default UV if not specified
        const mat = MATERIALS[currentMaterial];                 // get material definition previously hardcoded

        // use material color or default to white if can't find it
        // Also, check for glow. If true, multiply color by 5.0
        let baseColor = mat?.map_Kd ? [1, 1, 1] : (mat?.Kd || [0.8, 0.6, 0.4]);
        if (mat?.glow) {
            // Multiply RGB by 5 to make it super bright
            baseColor = [baseColor[0] * 5, baseColor[1] * 5, baseColor[2] * 5];
        }
        const color = baseColor;

        // calculate index for the new vertex, divide by 11 since each vertex has 11 floats
        const idx = mesh.vertices.length / 11;

        // add the vertex data to the mesh's vertex array
        mesh.vertices.push(position[0], position[1], position[2], normal[0], normal[1], normal[2], uv[0], uv[1], color[0], color[1], color[2]);
        // again cache it to avoid duplicates with key
        mesh.cache.set(key, idx);

        // return the index of the new vertex
        return idx;
    }

    // read obj file line by line 
    for (let line of text.split('\n')) {
        // removing all white space
        line = line.trim();

        // skip empty lines and comments
        if (!line || line[0] === '#') continue;

        // split lines into different parts based on whitespace
        const parts = line.split(/\s+/);  // Split by whitespace

        // get the command from the first part of the line to determine the type of data on this line
        const cmd = parts[0];

        // if the command is 'v', then it's a vertex position
        if (cmd === 'v') {
            // populating positions array with vertex coordinates
            positions.push(parts.slice(1).map(Number));
            // else if the command is 'vn', then it's a vertex normal
        } else if (cmd === 'vn') {
            // populating normals array with vertex normal coordinates
            normals.push(parts.slice(1).map(Number));
            // else if the command is 'vt', then it's a texture coordinate
        } else if (cmd === 'vt') {
            // getting u and v texture coordinates from the parts array
            const u = Number(parts[1]) || 0;
            const v = parts[2] ? Number(parts[2]) : 0;
            // populating uvs array with texture coordinates, have to flip the v coordinate because obj format uses bottom-left
            uvs.push([u, 1 - v]);
            // else if the command is 'usemtl', then it's a material switch
        } else if (cmd === 'usemtl') {
            // updating the current material to the new one specified
            currentMaterial = parts[1] || '';
            getSubmesh(currentMaterial);
            // else if the command if 'f', then it's a face definition
        } else if (cmd === 'f') {
            // parsing each vertex reference in the face
            const verts = parts.slice(1).map(v => {
                // splitting vertex reference into position, uv and normal indices
                const [posTok, uvTok, normTok] = v.split('/');
                // returning an object with the parsed indices as integers 
                return { position: parseInt(posTok), uv: uvTok ? parseInt(uvTok) : undefined, normal: normTok ? parseInt(normTok) : undefined };
            });
            // get the current material's submesh
            const mesh = getSubmesh(currentMaterial);
            // triangulate face using fan triangulation
            for (let i = 1; i + 1 < verts.length; i++) {
                // each triangle uses vertex 0, i, and i+1
                mesh.indices.push(addVertex(mesh, verts[0].position, verts[0].uv, verts[0].normal));
                mesh.indices.push(addVertex(mesh, verts[i].position, verts[i].uv, verts[i].normal));
                mesh.indices.push(addVertex(mesh, verts[i + 1].position, verts[i + 1].uv, verts[i + 1].normal));
            }
        }
    }
    // converting submeshes map to an array of objects with material name, vertex data, index data, index count and vertex count
    const result = [];
    // iterating through each submesh in the map
    for (const [name, mesh] of submeshes) {
        // populating the result array with submesh data
        result.push({
            material: name,
            vertexData: new Float32Array(mesh.vertices),
            // use Uint32Array if more than 65535 indices
            indexData: mesh.indices.length > 65535 ? new Uint32Array(mesh.indices) : new Uint16Array(mesh.indices),
            indexCount: mesh.indices.length,
            // divide by 11 since each vertex has 11 floats
            vertexCount: mesh.vertices.length / 11
        });
    }
    // returning the array of submeshes
    return result;
}

// main function to initialize WebGPU, load shaders, create pipeline, load geometry and render the scene
async function main() {

    // ---- WEBGPU SETUP ----
    // checking for webgpu support, hardware and adapter
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
    // getting the webgpu context from canvas and setting it up
    console.log("Getting the WebGPU context from our canvas element and configuring it.");
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('webgpu');
    const canvasFormat = 'bgra8unorm'; // Hard-coded canvas format (most common)
    context.configure({
        device,
        format: canvasFormat,
    });

    // ---- SHADERS ----
    // We are embedding the shader directly here so we can add the lighting logic easier.
    // This WGSL code calculates position, texture color, and spotlights.
    const shaderCode = `
        struct Uniforms {
            // The camera matrix
            viewProjectionMatrix : mat4x4<f32>,
            // Where the camera is (for reflections)
            cameraPosition : vec3<f32>,
            // Padding required by WebGPU alignment
            padding : f32,
            // 1.0 = On, 0.0 = Off
            lightToggle : f32,
        };
        // Group 0: Uniforms (Changes once per frame)
        @group(0) @binding(0) var<uniform> uniforms : Uniforms;

        struct VertexOut {
            @builtin(position) Position : vec4<f32>,
            @location(0) normal : vec3<f32>,
            @location(1) uv : vec2<f32>,
            @location(2) color : vec3<f32>,
            @location(3) worldPos : vec3<f32>,
        };

        @vertex
        fn vs_main(@location(0) pos : vec3<f32>, @location(1) norm : vec3<f32>, @location(2) uv : vec2<f32>, @location(3) col : vec3<f32>) -> VertexOut {
            var out : VertexOut;
            // Project the position to the screen using the matrix
            out.Position = uniforms.viewProjectionMatrix * vec4<f32>(pos, 1.0);
            out.worldPos = pos; // Pass the real 3D position to the pixel shader
            out.normal = norm;
            out.uv = uv;
            out.color = col;
            return out;
        }

        // Group 1: Material (Changes per object)
        @group(1) @binding(0) var mySampler : sampler;
        @group(1) @binding(1) var myTexture : texture_2d<f32>;

        // Helper function to calculate spotlight logic
        fn calcSpotlight(pos: vec3<f32>, dir: vec3<f32>, worldPos: vec3<f32>, normal: vec3<f32>, camPos: vec3<f32>) -> vec3<f32> {
            let lightToPixel = normalize(pos - worldPos);
            
            // 1. Cone logic: Check if pixel is inside the spotlight beam
            let angle = dot(-lightToPixel, normalize(dir));
            if (angle < 0.9) { return vec3<f32>(0.0); }
            
            // 2. Diffusion of light
            let diff = max(dot(normal, lightToPixel), 0.0);
            
            // 3. Specular: Shiny reflection
            let reflectDir = reflect(-lightToPixel, normal);
            let viewDir = normalize(camPos - worldPos);
            let spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0); // 32.0 = Shininess

            // 4. Distance, so light gets weaker further away
            let dist = distance(pos, worldPos);
            let atten = 1.0 / (1.0 + 0.1 * dist + 0.05 * dist * dist);

            // Combine results , light colour is warm white
            return (diff + spec) * vec3<f32>(1.0, 0.95, 0.8) * atten * 15.0;
        }

        @fragment
        fn fs_main(in : VertexOut) -> @location(0) vec4<f32> {
            // Get texture color mixed with vertex color
            let texColor = textureSample(myTexture, mySampler, in.uv) * vec4<f32>(in.color, 1.0);
            let normal = normalize(in.normal);
            
            // Ambient light so that it isn't pitch black when light is off
            let ambient = vec3<f32>(0.2, 0.2, 0.25);
            
            // Calculate two Spotlights
            let spot1 = calcSpotlight(vec3<f32>(-15.0, 15.0, -8.0), vec3<f32>(1.0, -0.8, 0.5), in.worldPos, normal, uniforms.cameraPosition);
            let spot2 = calcSpotlight(vec3<f32>(-15.0, 15.0, 8.0), vec3<f32>(1.0, -0.8, -0.5), in.worldPos, normal, uniforms.cameraPosition);
            
            // Combine ambient + (Spotlights * ToggleSwitch)
            let light = ambient + (spot1 + spot2) * uniforms.lightToggle;

            return vec4<f32>(texColor.rgb * light, texColor.a);
        }
    `;
    
    // creating shader module from the code above
    const module = device.createShaderModule({
        label: 'Lighting Shader',
        code: shaderCode
    });

    // ---- PIPELINE ----
    // creating the render pipeline with vertex and fragment shaders, input layouts, and depth-stencil state
    const pipeline = device.createRenderPipeline({
        label: 'Hardcoded pipeline',
        layout: 'auto',
        // vertex stage configuration
        vertex: {
            module,
            // vs main entry point to position each vertex on the screen
            entryPoint: 'vs_main',
            buffers: [{
                // number of bytes between elements in the array, used to jump from one vertex to the next
                arrayStride: 44, // pos(3) + normal(3) + uv(2) + color(3) = 11 floats * 4
                attributes: [
                    { shaderLocation: 0, offset: 0, format: 'float32x3' },  // position
                    { shaderLocation: 1, offset: 12, format: 'float32x3' }, // normal
                    { shaderLocation: 2, offset: 24, format: 'float32x2' }, // uv
                    { shaderLocation: 3, offset: 32, format: 'float32x3' }, // color
                ],
            }],
        },
        // fragment stage configuration
        fragment: {
            module,
            // fs main entry point to color each pixel on the screen
            entryPoint: 'fs_main',
            targets: [{ format: canvasFormat }],
        },
        // depth-stencil to prevent far object from drawing over close ones
        depthStencil: {
            format: 'depth24plus',
            depthWriteEnabled: true,
            depthCompare: 'less',
        },
        // tells GPU to interpret vertex data as list of triangles
        primitive: {
            topology: 'triangle-list',
            cullMode: 'none',
        },
    });

    // ---- UNIFORM BUFFER SETUP ----
    // Buffer to send global data like camera and lights to the GPU
    // Allocate 128 bytes to be safe
    const uniformBuffer = device.createBuffer({
        size: 128,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Create bind group 0 (uniforms) 
    // This group is shared by all objects in the scene
    const bindGroup0 = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }]
    });

    // ---- LOADING GEOMETRY ----
    // array to hold all submeshes from both models
    let submeshes = [];
    // hardcoded positioning values for models
    const modelCenter = [0.0, 0.0, 0.0];
    const scale = 0.025;
    const legodromeOffsetY = 0.0;
    const racecarOffsetY = 0.08;

    // using sampler for texture filtering to ensure smooth textures at all distances
    const sampler = device.createSampler({ magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear' });

    // creating a fallback white texture for material without texture so they can still show vertex colors and render properly
    const whiteTexture = device.createTexture({ size: [1, 1, 1], format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST });
    device.queue.writeTexture({ texture: whiteTexture }, new Uint8Array([255, 255, 255, 255]), { bytesPerRow: 4 }, { width: 1, height: 1 });

    // helper function to load texture images and create GPU textures using Canvas API
    async function loadTexture(name) {
        // return null if no texture name 
        if (!name) return null;
        try {
            // create an Image element to load the PNG
            const img = new Image();
            img.src = 'textures/' + name;
            // wait for the image to fully load
            await img.decode();

            // create a canvas matching the image dimensions
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            // draw the image onto the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // create gpu texture with the same dimensions as the loaded image
            const tex = device.createTexture({ size: [img.width, img.height, 1], format: 'rgba8unorm', usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT });
            // copy the canvas data into the GPU texture
            device.queue.copyExternalImageToTexture({ source: canvas }, { texture: tex }, [img.width, img.height]);
            // return the created texture
            return tex;
        } catch { return null; }
    }

    // loading models 
    const models = [{ url: 'meshes/Legodrome.obj', name: 'Legodrome' }, { url: 'meshes/Racecar.obj', name: 'Racecar' }];

    // for loop to load and process each model
    for (const model of models) {
        // parsing the obj files of models using helper function we created 
        const parsed = parseOBJ(await readFile(model.url));

        // Create buffers for each submesh
        for (const sm of parsed) {
            // get the index data array from the submesh
            let indexData = sm.indexData;
            // check if indices are uint16 or uint32
            let indexFormat = indexData instanceof Uint32Array ? 'uint32' : 'uint16';
            // check if index buffer size is not aligned to 4 bytes since its a WebGPU requirements
            if (indexData.byteLength % 4 !== 0) {
                // create a new array for proper alignment
                const temp = new Uint32Array(indexData.length);
                // copy all indices to the aligned array
                for (let i = 0; i < indexData.length; i++) temp[i] = indexData[i];
                // replace the index data with the aligned version
                indexData = temp;
                // update format to uint32 since we converted to it uint32array 
                indexFormat = 'uint32';
            }

            // create GPU buffer for vertex data (positions, normals, UVs, colors)
            const vb = device.createBuffer({ size: sm.vertexData.byteLength, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
            // create GPU buffer for index data connecting vertices into triangles
            const ib = device.createBuffer({ size: indexData.byteLength, usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST });
            // write vertex data from CPU to GPU buffer
            device.queue.writeBuffer(vb, 0, sm.vertexData.buffer, sm.vertexData.byteOffset, sm.vertexData.byteLength);
            // write index data from CPU to GPU buffer
            device.queue.writeBuffer(ib, 0, indexData.buffer, indexData.byteOffset, indexData.byteLength);

            // look up the material definition from hardcoded materials
            const mat = MATERIALS[sm.material] || {};
            // loading the texture for this material if it has one
            const tex = await loadTexture(mat.map_Kd);
            // use white texture for materials without textures 
            const finalTex = tex || whiteTexture;
            // create bind group connecting the texture and sampler to the shader
            const bindGroup = device.createBindGroup({ layout: pipeline.getBindGroupLayout(1), entries: [{ binding: 0, resource: sampler }, { binding: 1, resource: finalTex.createView() }] });

            // set vertical offset based on model name
            const modelOffsetY = model.name === 'Racecar' ? racecarOffsetY : legodromeOffsetY;

            // adding the submesh with data to the submeshes array
            submeshes.push({ model: model.name, material: sm.material, vertexBuffer: vb, indexBuffer: ib, indexCount: sm.indexCount, indexFormat, originalVertexData: sm.vertexData, workingVertexData: new Float32Array(sm.vertexData.length), bindGroup, modelOffsetY });
        }
    }

    // ---- RENDER PASS ----
    const renderPassDescriptor = {
        label: 'Main render pass',
        colorAttachments: [{
            view: undefined, // Assigned in loop
            clearValue: [0.1, 0.1, 0.15, 1.0], // Dark sky colour
            loadOp: 'clear', storeOp: 'store',
        }],
        depthStencilAttachment: {
            view: undefined, // Assigned in loop
            depthClearValue: 1.0, depthLoadOp: 'clear', depthStoreOp: 'store',
        }
    };

    let depthTexture = null;
    function createDepthTexture() {
        if (depthTexture) depthTexture.destroy();
        depthTexture = device.createTexture({
            size: [canvas.width, canvas.height],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
    }

    // Initialise camera and lights
    const camera = new Camera(canvas, 5, 0, 0.5);
    let lightToggle = 1.0;

    // Car physics variables
    let carX = -0.2; 
    let carZ = 0.5; 
    let carAngle = -40 * Math.PI / 180;
    const keys = { w: false, a: false, s: false, d: false };

    window.addEventListener('keydown', (e) => {
        const k = e.key.toLowerCase();
        
        // Mark the key as pressed
        if (keys.hasOwnProperty(k)) keys[k] = true;

        // Toggle the light
        if (k === 'l') {
            lightToggle = lightToggle > 0.5 ? 0.0 : 1.0;
            console.log("Lights:", lightToggle ? "ON" : "OFF");
        }
    });

    window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (keys.hasOwnProperty(k)) keys[k] = false;
    });

    function render() {
        // 1. Resize handling
        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
        const height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            createDepthTexture();
        }

        // 2. Car Physics
        const speed = 0.02;
        const turnSpeed = 0.05;

        // Rotation (A/D)
        if (keys.a) carAngle += turnSpeed;
        if (keys.d) carAngle -= turnSpeed;

        // Movement (W/S)
        // Sin/Cos to separate the speed into X and Z movement
        if (keys.w) {
            carX -= Math.sin(carAngle) * speed; 
            carZ -= Math.cos(carAngle) * speed;
        }
        if (keys.s) {
            carX += Math.sin(carAngle) * speed; 
            carZ += Math.cos(carAngle) * speed;
        }

        // 3. Update camera & matrices
        camera.update();
        const fov = 35 * Math.PI / 180;
        const proj = wm.mat4.perspective(fov, width / height, 0.1, 100.0);
        const view = camera.getMatrix();
        const vp = wm.mat4.multiply(proj, view);
        const camPos = camera.getPosition();

        // 4. Upload uniforms (matrix + light info)
        const f32 = new Float32Array(32); 
        f32.set(vp, 0);                 // 0-15: ViewProjection
        f32.set(camPos, 16);            // 16-18: Camera Position
        f32.set([lightToggle], 20);     // 20: Light Toggle
        device.queue.writeBuffer(uniformBuffer, 0, f32);

        // 5. Update geometry
        for (const s of submeshes) {
            const orig = s.originalVertexData;
            const work = s.workingVertexData;
            // Iterate vertices (stride 11)
            for (let i = 0; i < orig.length; i += 11) {
                // Apply scaling/positioning
                let px = (orig[i+0] - modelCenter[0]) * scale;
                let py = (orig[i+1] - modelCenter[1]) * scale + s.modelOffsetY;
                let pz = (orig[i+2] - modelCenter[2]) * scale;

                if (s.model === 'Racecar') {
                    // 1. ROTATE
                    // rotate the visuals to match the physics
                    const meshCorrection = -Math.PI / 2;
                    
                    const finalAngle = carAngle + meshCorrection;

                    const c = Math.cos(finalAngle);
                    const sn = Math.sin(finalAngle);
                    
                    const rx = c * px + sn * pz;
                    const rz = -sn * px + c * pz;
                    
                    px = rx; 
                    pz = rz;

                    // 2. SCALE
                    px *= 0.87; pz *= 0.87; py *= 0.87;

                    // 3. TRANSLATE
                    px += carX; 
                    pz += carZ;
                }

                // Write world coordinates, shader will do projection
                work[i+0] = px; work[i+1] = py; work[i+2] = pz; 
                // Copy normal/uv/color unchanged
                for(let k=3; k<11; k++) work[i+k] = orig[i+k];
            }
            device.queue.writeBuffer(s.vertexBuffer, 0, work);
        }

        // 6. Draw
        renderPassDescriptor.colorAttachments[0].view = context.getCurrentTexture().createView();
        renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView();

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass(renderPassDescriptor);
        pass.setPipeline(pipeline);
        
        pass.setBindGroup(0, bindGroup0); // Uniforms

        for (const s of submeshes) {
            pass.setBindGroup(1, s.bindGroup); // Textures
            pass.setVertexBuffer(0, s.vertexBuffer);
            pass.setIndexBuffer(s.indexBuffer, s.indexFormat);
            pass.drawIndexed(s.indexCount);
        }
        pass.end();
        device.queue.submit([encoder.finish()]);
        requestAnimationFrame(render);
    }

    // creating initial depth texture before first render
    createDepthTexture();
    requestAnimationFrame(render);
}

main();
