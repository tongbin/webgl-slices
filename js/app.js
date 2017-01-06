var vertexShaderText = [
  'precision mediump float;',
  '',
  'attribute vec2 vectPostion;',
  'attribute vec3 colorPostion;',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  '  gl_Position = vec4(vectPostion, 0.0, 1.0);',
  '  fragColor = colorPostion;',
  '}'
].join('\n');

var fragmentShaderText = [
  'precision mediump float;',
  '',
  'varying vec3 fragColor;',
  'void main()',
  '{',
  '  gl_FragColor = vec4(fragColor, 1.0);',
  '}'
].join('\n');

function initGame() {
  var canvas = document.getElementById('game-surface');
  var gl = canvas.getContext('webgl');
  if (!gl) {
    console.log('failing back to experimental webgl ');
    gl = canvas.getContext('experimental-webgl');
  }
  if (!gl) {
    alert('your brower doesn\'t support webgl.');
    return;
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compile vertex shader', gl.getShaderInfoLog(vertexShader));
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('ERROR compile vertex shader', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  // create program
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log('ERROR link program', gl.getProgramInfoLog(program));
    return;
  }
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.log('ERROR validate program', gl.getProgramInfoLog(program));
    return;
  }
  // upload buffer
  var triangleVertices = [
    // X,Y,R,G,B
    0, 0.5,     1.0, 0.0, 0.0,
    -0.5, -0.5, 0.0, 1.0, 0.0,
    0.5, -0.5,  0.0, 0.0, 1.0
  ];

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

  var positionAttribLocation = gl.getAttribLocation(program, 'vectPostion');
  var colorAttribLocation = gl.getAttribLocation(program, 'colorPostion');
  gl.vertexAttribPointer(
    positionAttribLocation,// attribute location
    2, // number of elements per attribute
    gl.FLOAT, // element type
    gl.FALSE, // normalized
    5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
    0 // offset
  );
  gl.vertexAttribPointer(
    colorAttribLocation,// attribute location
    3,
    gl.FLOAT,
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT
  );
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  // main loop
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

}