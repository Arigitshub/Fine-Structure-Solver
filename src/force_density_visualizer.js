import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// Quantum Electrodynamic Constants
let inverseAlpha = 137.035999;
let alpha = 1.0 / inverseAlpha;

// Set up the UI Binding
const alphaSlider = document.getElementById('alphaSlider');
const alphaValueDisplay = document.getElementById('alphaValue');

alphaSlider.addEventListener('input', (e) => {
  inverseAlpha = parseFloat(e.target.value);
  alphaValueDisplay.innerText = inverseAlpha.toFixed(6);
  alpha = 1.0 / inverseAlpha;
  if(material) {
    material.uniforms.u_Alpha.value = alpha;
  }
});

// Snapshot Data Pipeline
const snapshotBtn = document.getElementById('snapshotBtn');
snapshotBtn.addEventListener('click', () => {
    // We must ensure preservedDrawingBuffer is true in renderer to grab the frame
    try {
        const dataURL = renderer.domElement.toDataURL('image/png');
        
        // Bundle the snapshot state
        const statePackage = {
            metadata: {
                timestamp: new Date().toISOString(),
                inverse_alpha: inverseAlpha,
                coupling_constant: alpha,
                description: "Fine-Structure-Solver Electrostatic Force Density Snapshot"
            },
            snapshot_uri: dataURL
        };

        // Create a downloadable JSON blob
        const blob = new Blob([JSON.stringify(statePackage, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `force_density_state_${inverseAlpha.toFixed(2)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log("✅ Successfully exported WebGL State Pipeline Data");
    } catch (err) {
        console.error("Snapshot failed: ensure preserveDrawingBuffer is enabled on WebGLRenderer", err);
    }
});

// Scene setup
const container = document.getElementById('glcontainer');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Build the Quantum Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_Alpha;
  uniform float u_Time;
  varying vec2 vUv;
  
  void main() {
    // Probability Density Mapping (Electrostatic Force Vectors)
    vec2 pos = vUv * 2.0 - 1.0;
    
    // Simulating tension gradient: Repulsion vs Nuclear Binding scaled by alpha
    float dist = length(pos);
    
    // Wave function approximation
    float wave = sin(dist * 20.0 - u_Time * 5.0);
    
    // The force vectors push apart or bind based on the coupling constant tension
    float tension = smoothstep(0.1, 0.8, dist * u_Alpha * 150.0) * wave;
    
    // Render the tension gradient: deep purple/blue to vibrant cyan
    vec3 color = mix(vec3(0.1, 0.0, 0.3), vec3(0.0, 1.0, 0.8), tension + 0.5);
    
    // Core glow
    float core = 0.05 / (dist + 0.01);
    color += vec3(core) * u_Alpha * 100.0;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    u_Alpha: { value: alpha },
    u_Time: { value: 0.0 }
  },
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true
});

// Create a simple plane or sphere to visualize the density matrix
const geometry = new THREE.SphereGeometry(2, 64, 64);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  
  material.uniforms.u_Time.value = clock.getElapsedTime();
  
  // Rotate the density cloud over time
  mesh.rotation.y += 0.002;
  mesh.rotation.x += 0.001;
  
  renderer.render(scene, camera);
}

animate();
