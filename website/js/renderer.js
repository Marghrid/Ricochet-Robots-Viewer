var quad = [-1.0,-1.0,
    1.0,-1.0,
    -1.0,1.0,
 
     -1.0,1.0,
     1.0,-1.0,
     1.0,1.0];


function createShader(gl,type,source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    sucess = gl.getShaderParameter(shader,gl.COMPILE_STATUS);
    if(sucess){
        return shader;
    }
    throw gl.getShaderInfoLog(shader);
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl,vertexShader,fragmentShader){
    var program = gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var sucess = gl.getProgramParameter(program,gl.LINK_STATUS);

    if(sucess){
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
} 


class Renderer{
    constructor(){
        this.updateResolution();
        this._initGLData();
        
    }



    updateResolution(){
        this.resolution = [canvas.width,canvas.height];
        this.aspect_ratio = canvas.width/canvas.height;
        
    }

    render(scene){
        gl.clearColor(this.bgColor[0],this.bgColor[1],this.bgColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.useProgram(this.programs.board);
        gl.bindVertexArray(this.vaos.board);
        
        gl.uniform1f(this.uniformLoc.board.board_size, scene.board_size);
        gl.uniform1f(this.uniformLoc.board.grid_width, scene.grid_width);
        
        gl.uniform1f(this.uniformLoc.board.v_scale, scene.v_scale);
        gl.uniform1f(this.uniformLoc.board.aspect_ratio, this.aspect_ratio);
        gl.uniform2f(this.uniformLoc.board.center, scene.center[1],scene.center[0]);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }

    _initGLData(){
        this._initBoard();

    }

    _initBoard(){
        
        this.programs = {}
        this.uniformLoc = {}
        this.attributeLoc = {}
        this.vaos = {}
        let vs = `// an attribute will receive data from a buffer
        attribute vec4 a_position;
        uniform float board_size;
        uniform float grid_width;
        uniform float v_scale;
        uniform float aspect_ratio;
        uniform vec2 center;
        varying vec2 pos;
        // all shaders have a main function
        void main() {
       
          // gl_Position is a special variable a vertex shader
          // is responsible for setting
          gl_Position = vec4( (a_position.xy*0.5*(board_size+2.0*grid_width)
                              + board_size*0.5 - center)*v_scale
                               + vec2(0.5),
                               a_position.z,
                               a_position.w);  

          gl_Position.x *= aspect_ratio;
          pos=gl_Position.xy;
        }
        `;

        let fs = `     
        precision mediump float;
        varying vec2 pos;
        void main() {
          // gl_FragColor is a special variable a fragment shader
          // is responsible for setting
          gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // return reddish-purple
        }
        `;

        let vertexShader = createShader(gl,gl.VERTEX_SHADER, vs);
        let fragmentShader = createShader(gl,gl.FRAGMENT_SHADER, fs);
        this.programs.board = createProgram(gl,vertexShader,fragmentShader);


        this.attributeLoc.board = {
            position: gl.getAttribLocation(this.programs.board, "position")
        }
        this.uniformLoc.board = {
            board_size: gl.getUniformLocation(this.programs.board, "board_size"),
            grid_width: gl.getUniformLocation(this.programs.board, "grid_width"),
            v_scale: gl.getUniformLocation(this.programs.board, "v_scale"),
            aspect_ratio: gl.getUniformLocation(this.programs.board, "aspect_ratio"),
            center: gl.getUniformLocation(this.programs.board, "center"),
        }
        
        this.vaos.board = gl.createVertexArray();
        gl.bindVertexArray(this.vaos.board);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());    
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quad),gl.STATIC_DRAW);
        gl.enableVertexAttribArray(this.attributeLoc.board.position);
        var size=2;
        var type=gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(this.attributeLoc.board.position,size,type,normalize,stride,offset);

    }
}