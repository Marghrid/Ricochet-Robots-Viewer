uniform vec2 scale;
uniform vec2 offset;

precision mediump float;
 
void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // return reddish-purple
}