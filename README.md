# Fine-Structure-Solver: Quantum Render Pipeline

Fine-Structure-Solver is a high-performance WebGL 2.0 and Three.js environment dedicated to the visualization of atomic force-density and quantum electrodynamic states.

## Architecture

This interactive "Glass Box" repository relies on the browser's GPU to compute parallelized physics:
1. **The Canvas (`index.html`)**: The full-screen rendering target overlaid with interactive telemetry controls.
2. **WebGL Renderer (`src/force_density_visualizer.js`)**: Initializes the Three.js scene, OrbitControls, and handles state-management export pipelines.
3. **Compute Shaders (`src/shaders/force_density.glsl`)**: Custom GLSL shader material where the theoretical math is processed per-pixel.

### The Physics: Quantum Electrodynamics

This repository visualizes the tension gradients that maintain atomic stability, governed by the injected baseline: **The Coupling Constant Base** ($\alpha \approx 1/137.035999$).

The GLSL shader calculates the **Probability Density Mapping**, rendering the Electrostatic Force Vectors. In our visual model, the repulsion pushing electrons apart versus the forces keeping them bound to the nucleus is mapped dynamically as a gradient color map (tension).

## Installation

This environment is built with vanilla HTML/JS and relies on an ES module import of Three.js. No deep Node.js architecture is required, but you must run a local server to avoid CORS issues with the shader modules.

```bash
npm install three
npx serve .
```

## How to Run

**1. Interactive Alpha Slider**
Launch the local web server and open `index.html`. You will see the atomic probability cloud. Use the UI slider on the left to physically manipulate the Inverse Fine-Structure Constant. The shader will recalculate the electrostatic tension mapping in real-time.

**2. Snapshot State Pipeline**
To record your findings:
1. Frame the camera using your mouse (OrbitControls are active).
2. Adjust the $\alpha$ slider to the desired theoretical value.
3. Click the **📸 Export Snapshot Pipeline** button.

The engine will capture the current WebGL canvas as a PNG Data URI, bundle it with the precise floating-point $\alpha$ parameter, and download it as a reproducible `force_density_state_XXX.json` package.
