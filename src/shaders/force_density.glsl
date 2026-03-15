#version 300 es
precision highp float;

/*
  Stub for the Atomic Force-Density compute shader.
  This shader will be responsible for parallelizing the high-performance
  calculations of quantum electromagnetic forces between atomic structures
  and resolving them into a localized 3D spatial density matrix.
*/

// Uniforms for the atomic state vectors (positions, charges)
// uniform vec3 u_Atoms[MAX_ATOMS];
// uniform float u_Charges[MAX_ATOMS];

out vec4 fragColor;

void main() {
    // Placeholder output: rendering empty void until compute solver is active
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
