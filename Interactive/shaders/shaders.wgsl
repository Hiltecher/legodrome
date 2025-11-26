@group(0) @binding(0) var samp : sampler;
@group(0) @binding(1) var tex  : texture_2d<f32>;

struct VertexOut {
    @builtin(position) Position : vec4<f32>,
    @location(0) normal : vec3<f32>,
    @location(1) uv : vec2<f32>,
    @location(2) color : vec3<f32>,
};

@vertex
fn vs_main(@location(0) position : vec3<f32>, @location(1) normal : vec3<f32>, @location(2) uv : vec2<f32>, @location(3) color : vec3<f32>) -> VertexOut {
    var out : VertexOut;
    out.Position = vec4<f32>(position, 1.0);
    out.normal = normalize(normal);
    out.uv = uv;
    out.color = color;
    return out;
}

@fragment
fn fs_main(in : VertexOut) -> @location(0) vec4<f32> {
    let lightDir = normalize(vec3<f32>(0.5, 0.8, 0.6));
    let diff = max(dot(in.normal, lightDir), 0.0);
    let tcol = textureSample(tex, samp, in.uv).rgb;
    let base = in.color * tcol;
    return vec4<f32>(base * (0.2 + 0.8 * diff), 1.0);
}
