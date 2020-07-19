class TexturedObj {
    constructor(x,y,size,color, texture_src){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;


        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
 
        var texture = this.texture;
        // Fill the texture with a 1x1 blue pixel.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([255, 0, 255, 255]));
 
        // Asynchronously load an image
        var image = new Image();
        image.src = texture_src;
        image.addEventListener('load', function() {
            //Now that the image has loaded make copy it to the texture.
            
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
            gl.generateMipmap(gl.TEXTURE_2D);
        });

        
    }
}


class Scene {
    constructor(){
        this.bgColor=createColor(240,240,240);
        this.board_color = createColor(240,240,240);
        this.grid_color  = createColor(150,150,150);
        this.wall_color  = createColor(30,30,30);
        this.grid_width = 0.02;
        
        this.yellow     = createColor(255,198, 41);
        this.green      = createColor(  0,168,  6);
        this.blue       = createColor(  0,127,212);
        this.red        = createColor(240, 31, 87);        
        this.robots = {};

        this.robot_src = ["robots/robot1.png","robots/robot2.png","robots/robot3.png","robots/robot4.png"]
        this.goal_src ="robots/goal1.png";


        var size = 0.9;
        this.robots.yellow = new TexturedObj(0.5,0.5,size,this.yellow,this.robot_src[0]);
        this.robots.green  = new TexturedObj(0.5,2.5,size,this.green,this.robot_src[1]);
        this.robots.blue   = new TexturedObj(2.5,0.5,size,this.blue,this.robot_src[2]);
        this.robots.red    = new TexturedObj(2.5,2.5,size,this.red,this.robot_src[3]);
        this.goal = new TexturedObj(1.5,1.5,size,this.yellow, this.goal_src);
        this.board_size = 5;
        var right_walls = [[1,4],[5,6],[2,5],[2,6],[3,5],[3,6]];
        var bottom_walls = [[0,0],[6,0],[2,6],[2,7],[3,6],[3,7]];


        this.center = [this.board_size/2,this.board_size/2];
        this.v_zoom = 2/(this.board_size+6*this.grid_width);

        this._createTexture(this.board_size);
        this._updateTexture(right_walls,bottom_walls,[],[]);    

    }

    _createTexture(size){
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        this.texture_data = {}
        this.texture_data.level = 0;
        this.texture_data.internalFormat = gl.RGB;
        this.texture_data.width = size;
        this.texture_data.height = size;
        console.log(this.texture_data.width,this.texture_data.height)
        this.texture_data.border = 0;
        this.texture_data.format = gl.RGB;
        this.texture_data.type = gl.UNSIGNED_BYTE;
        

        //TODO: docs say this is init to zero
        // IS IT TRUE?
    
        this.texture_data.data = new Uint8Array(3*this.texture_data.width*this.texture_data.height);
        
        for(let i in this.texture_data.data){
            //if(i%3==1){
                this.texture_data.data[i] = 0;
            
            //} else {
             //   this.texture_data.data[i] = 255;
            //}
        }
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.texImage2D(gl.TEXTURE_2D, this.texture_data.level, this.texture_data.internalFormat, 
                                    this.texture_data.width, this.texture_data.height, 
                                    this.texture_data.border, this.texture_data.format, 
                                    this.texture_data.type, this.texture_data.data);
         
        // set the filtering so we don't need mips and it's not filtered
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    _get_texture_idx(x,y){
        return (this.texture_data.width*y + x)*3;
    }
    _convert_coordinates(pos){
        return [pos[1],this.board_size-1 - pos[0]]
    }
    _updateTexture(add_right, add_bottom, remove_right, remove_bottom){
        for(let i in add_right){
            let xy = this._convert_coordinates(add_right[i]);
            let x = xy[0];
            let y = xy[1];
            this.texture_data.data[this._get_texture_idx(x,y)] = (255); 
        }
        for(let i in add_bottom){
            let xy = this._convert_coordinates(add_bottom[i]);
            let x = xy[0];
            let y = xy[1];
            this.texture_data.data[this._get_texture_idx(x,y)+1] = (255); 
        }
        for(let i in remove_right){
            let xy = this._convert_coordinates(remove_right[i]);
            let x = xy[0];
            let y = xy[1];
            this.texture_data.data[this._get_texture_idx(x,y)] = (0); 
        }
        for(let i in remove_bottom){
            let xy = this._convert_coordinates(remove_bottom[i]);
            let x = xy[0];
            let y = xy[1];
            this.texture_data.data[this._get_texture_idx(x,y)+1] = (0); 
        }
        //TODO check if this is needed
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
        gl.texImage2D(gl.TEXTURE_2D, this.texture_data.level, this.texture_data.internalFormat, 
            this.texture_data.width, this.texture_data.height, 
            this.texture_data.border, this.texture_data.format, 
            this.texture_data.type, this.texture_data.data);

        
    }


}