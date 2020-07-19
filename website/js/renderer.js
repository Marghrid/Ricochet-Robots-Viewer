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
                
        gl.disable(gl.DEPTH_TEST);
        
        gl.clearColor(scene.bgColor[0],scene.bgColor[1],scene.bgColor[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        this._board_render(scene);
        this._robots_goal_render(scene);
    }


    _initGLData(){
        this._initBoard();
        this._initTextured();

    }

    _board_render(scene){
        

        gl.useProgram(this.programs.board);

        
        gl.bindVertexArray(this.vaos.board);
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,scene.texture);
        gl.uniform1i(this.uniformLoc.board.wallTexture, 0);
        
        gl.uniform1f(this.uniformLoc.board.board_size, scene.board_size);
        gl.uniform1f(this.uniformLoc.board.grid_width, scene.grid_width);
        
        gl.uniform1f(this.uniformLoc.board.v_zoom, scene.v_zoom);
        gl.uniform1f(this.uniformLoc.board.aspect_ratio, this.aspect_ratio);
        //TODO CHECK BUGS
        gl.uniform2f(this.uniformLoc.board.center, scene.center[1],scene.board_size-scene.center[0]);
        
        gl.uniform3fv(this.uniformLoc.board.wall_color, scene.wall_color);
        gl.uniform3fv(this.uniformLoc.board.grid_color, scene.grid_color);
        gl.uniform3fv(this.uniformLoc.board.board_color, scene.board_color);

        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
    }
    _robots_goal_render(scene){
        gl.useProgram(this.programs.textured);
        gl.bindVertexArray(this.vaos.board);
        gl.activeTexture(gl.TEXTURE0);

       


        for(let robot in scene.robots){
            
            gl.bindTexture(gl.TEXTURE_2D,scene.robots[robot].texture);
            gl.uniform1i(this.uniformLoc.textured.image, 0);
            gl.uniform1f(this.uniformLoc.textured.v_zoom, scene.v_zoom);
            gl.uniform1f(this.uniformLoc.textured.aspect_ratio, this.aspect_ratio);
            gl.uniform1f(this.uniformLoc.textured.size, scene.robots[robot].size);
            gl.uniform2f(this.uniformLoc.textured.center, scene.center[1],scene.board_size-scene.center[0]);
            gl.uniform3fv(this.uniformLoc.textured.color, scene.robots[robot].color);
            gl.uniform2f(this.uniformLoc.textured.pos, scene.robots[robot].y,scene.board_size-scene.robots[robot].x);
            var primitiveType = gl.TRIANGLES;
            var offset = 0;
            var count = 6;
            gl.drawArrays(primitiveType, offset, count);
        }
        gl.bindTexture(gl.TEXTURE_2D,scene.goal.texture);
        gl.uniform1i(this.uniformLoc.textured.image, 0);
        gl.uniform1f(this.uniformLoc.textured.v_zoom, scene.v_zoom);
        gl.uniform1f(this.uniformLoc.textured.aspect_ratio, this.aspect_ratio);
        gl.uniform1f(this.uniformLoc.textured.size, scene.goal.size);
        gl.uniform2f(this.uniformLoc.textured.center, scene.center[1],scene.board_size-scene.center[0]);
        gl.uniform3fv(this.uniformLoc.textured.color, scene.goal.color);
        gl.uniform2f(this.uniformLoc.textured.pos, scene.goal.y,scene.board_size-scene.goal.x);
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6;
        gl.drawArrays(primitiveType, offset, count);
        
    }
    _initBoard(){
        
        this.programs = {}
        this.uniformLoc = {}
        this.attributeLoc = {}
        this.vaos = {}
        let vs = `#version 300 es
        // an attribute will receive data from a buffer
        in vec4 a_position;
        uniform float board_size;
        uniform float grid_width;
        uniform float v_zoom;
        uniform float aspect_ratio;
        uniform vec2 center;
        out vec2 pos;
        out float grid_w;
        out float bs;
        // all shaders have a main function
        void main() {
       
          // gl_Position is a special variable a vertex shader
          // is responsible for setting
          vec2 tmp = (a_position.xy*0.5*(board_size+2.0*grid_width)
          + board_size*0.5) ;
          gl_Position = vec4( (tmp  - center)*v_zoom
                               + vec2(0.5),
                               a_position.z,
                               1.0);

          
          gl_Position = vec4((tmp-center)*v_zoom,
          a_position.z,
          1.0);
 
                                
                               
          //gl_Position = a_position;
          //gl_Position.xy = gl_Position.xy*0.4;
          gl_Position.x = gl_Position.x/aspect_ratio;
          grid_w = grid_width;
          bs = board_size;

          pos=tmp;
        }
        `;

        let fs = `#version 300 es
        precision mediump float;
        in vec2 pos;
        in float grid_w;
        in float bs;
        out vec4 frag_color;
        uniform sampler2D wallTexture;
        uniform vec3 wall_color;
        uniform vec3 grid_color;
        uniform vec3 board_color;
        void main() {
          // gl_FragColor is a special variable a fragment shader
          // is responsible for setting
        

          if(pos.x>0.0 && pos.y > 0.0f)
            frag_color = vec4(board_color, 1.0); // return reddish-purple
          else
            frag_color = vec4(wall_color,1.0f);
          if(fract(pos.x)>=(1. - grid_w) || fract(pos.y)>=(1.-grid_w) || fract(pos.x) <=grid_w || fract(pos.y) <=grid_w ){
            frag_color = vec4(grid_color,1.0);
          }
          if(pos.x<grid_w || pos.y<grid_w || pos.x>=bs - grid_w || pos.y>=bs - grid_w){
              frag_color =vec4(wall_color,1.0);
          }

          vec2 help = pos-vec2(grid_w,-grid_w);
          ivec2 tile = ivec2(floor(help)) + ivec2(0,0);
          vec2 xy = texelFetch(wallTexture,tile,0).rg;
          if(fract(help).x >=(1.0-2.0*grid_w) && fract(help).y>2.0*grid_w){
            if(xy.x>0.5)
                frag_color =vec4(wall_color,1.0);
          }

          if(fract(help).y <=(2.0*grid_w)  && fract(help).x<1.0-2.0*grid_w){
            if(xy.y>0.5)
                frag_color =vec4(wall_color,1.0);
          }
          
          //frag_color = vec4(texelFetch(wallTexture,ivec2(floor(pos)),0).rgb,1.0);
        }
        `;

        let vertexShader = createShader(gl,gl.VERTEX_SHADER, vs);
        let fragmentShader = createShader(gl,gl.FRAGMENT_SHADER, fs);
        this.programs.board = createProgram(gl,vertexShader,fragmentShader);


        this.attributeLoc.board = {
            position: gl.getAttribLocation(this.programs.board, "a_position")
        }
        this.uniformLoc.board = {
            board_size: gl.getUniformLocation(this.programs.board, "board_size"),
            grid_width: gl.getUniformLocation(this.programs.board, "grid_width"),
            v_zoom: gl.getUniformLocation(this.programs.board, "v_zoom"),
            aspect_ratio: gl.getUniformLocation(this.programs.board, "aspect_ratio"),
            center: gl.getUniformLocation(this.programs.board, "center"),
            wallTexture: gl.getUniformLocation(this.programs.board, "wallTexture"),
            board_color: gl.getUniformLocation(this.programs.board, "board_color"),
            grid_color: gl.getUniformLocation(this.programs.board, "grid_color"),
            wall_color: gl.getUniformLocation(this.programs.board, "wall_color"),
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

    _initTextured(){
        
        let vs = `#version 300 es
        // an attribute will receive data from a buffer
        in vec4 a_position;
        uniform float size;
        uniform float v_zoom;
        uniform float aspect_ratio;
        uniform vec2 center;
        uniform vec2 pos;
        out vec2 uv;
        // all shaders have a main function
        void main() {
       
          // gl_Position is a special variable a vertex shader
          // is responsible for setting
          uv = a_position.xy*0.5+0.5;
          vec2 tmp = (a_position.xy*size*0.5 + pos) ;
          gl_Position = vec4( (tmp  - center)*v_zoom
                               + vec2(0.5),
                               a_position.z,
                               1.0);

          
          gl_Position = vec4((tmp-center)*v_zoom,
          a_position.z,
          1.0);
          gl_Position.x = gl_Position.x/aspect_ratio;

        }
        `;

        let fs = `#version 300 es
        precision mediump float;
        in vec2 uv;
        out vec4 frag_color;
        uniform sampler2D image;
        uniform vec3 color;
        const int SAMPLES = 4;
        void main() {
          // gl_FragColor is a special variable a fragment shader
          // is responsible for setting
        
          float alpha = texture(image,vec2(uv.x,1.0-uv.y)).r;
    
                 
          frag_color = vec4(color*alpha,alpha);
          if(alpha<0.05){
              discard;
          }
          //frag_color = vec4(texture(image,uv));
        
        }
        `;

        let vertexShader = createShader(gl,gl.VERTEX_SHADER, vs);
        let fragmentShader = createShader(gl,gl.FRAGMENT_SHADER, fs);
        this.programs.textured = createProgram(gl,vertexShader,fragmentShader);


        this.attributeLoc.textured = {
            position: gl.getAttribLocation(this.programs.textured, "a_position")
        }
        this.uniformLoc.textured = {
            size: gl.getUniformLocation(this.programs.textured, "size"),
            v_zoom: gl.getUniformLocation(this.programs.textured, "v_zoom"),
            pos: gl.getUniformLocation(this.programs.textured, "pos"),
            aspect_ratio: gl.getUniformLocation(this.programs.textured, "aspect_ratio"),
            center: gl.getUniformLocation(this.programs.textured, "center"),
            image: gl.getUniformLocation(this.programs.textured, "image"),
            color: gl.getUniformLocation(this.programs.textured, "color")
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