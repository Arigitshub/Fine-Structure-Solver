// Initialization for the High-Performance WebGL 2.0 context
const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl2', { antialias: false, depth: false });

if (!gl) {
  document.getElementById('status').innerText = 'Status: FAILED - WebGL 2.0 not supported.';
  console.error('WebGL 2 context not available.');
} else {
  document.getElementById('status').innerText = 'Status: WebGL 2.0 Context Initialized. Awaiting force-density data.';
}

// Function to handle resizing
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if(gl) gl.viewport(0, 0, canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Render loop stub
function renderLoop() {
  if (!gl) return;
  // Clear the canvas to the background color
  gl.clearColor(0.02, 0.02, 0.06, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Future integration point for rendering the compute shader output
  // representing the atomic force-density fields

  requestAnimationFrame(renderLoop);
}

// Start the empty render loop
renderLoop();
