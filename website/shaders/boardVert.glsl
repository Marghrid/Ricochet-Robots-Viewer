  // an attribute will receive data from a buffer
  attribute vec4 a_position;
  // all shaders have a main function
  void main() {
 
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = vec4((a_position.xy,a_position.z,a_position.w); 
  }