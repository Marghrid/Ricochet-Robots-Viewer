class Robot {
    constructor(x,y,size,color){
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
    }
}


class Scene {
    constructor(){
        this.center = [4.0,4.0];
        this.v_zoom = 0.1;
        
        
        
        
        this.inner_color = createColor(255,0,255);
        this.grid_color  = createColor(255,0,0);
        this.wall_color  = createColor(0,0,0);
        this.grid_width = 0.02;
        
        this.yellow     = createColor(255,198, 41);
        this.green      = createColor(  0,168,  6);
        this.blue       = createColor(  0,127,212);
        this.red        = createColor(240, 31, 87);        
        this.robots = {};
        var size = 0.9;
        this.robots.yellow = new Robot(0.5,0.5,size,this.yellow);
        this.robots.green  = new Robot(0.5,2.5,size,this.green);
        this.robots.blue   = new Robot(2.5,0.5,size,this.blue);
        this.robots.red    = new Robot(2.5,2.5,size,this.red);
        
        this.board_size = 8;
        var right_walls = [[1,4],[5,6]];
        var bottom_walls = [[0,0],[7,0]];

        this._createTexture(this.board_size);
        this._updateTexture(right_walls,bottom_walls,[],[]);    

    }

    _createTexture(size){
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        this.texture_data = 
        this.texture_data.level = 0;
        this.texture_data.internalFormat = gl.RGB;
        this.texture_data.width = size[0]-1;
        this.texture_data.height = size[1]-1;
        this.texture_data.border = 0;
        this.texture_data.format = gl.RGB;
        this.texture_data.type = gl.UNSIGNED_BYTE;
        

        //TODO: docs say this is init to zero
        // IS IT TRUE?
        this.texture_data.data = new Uint8Array(3*this.texture_data.width*this.texture_data.height);
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
        return (this.texture_data.width*y + x)*3
    }
    _updateTexture(add_right, add_bottom, remove_right, remove_bottom){
        for(let i in add_right){
            y = add_right[i][0];
            x = add_right[i][1];
            this.texture_data.data[this._get_texture_idx(x,y)] = uint8(255); 
        }
        for(let i in add_bottom){
            y = add_right[i][0];
            x = add_right[i][1];
            this.texture_data.data[this._get_texture_idx(x,y)+1] = uint8(255); 
        }
        for(let i in remove_right){
            y = add_right[i][0];
            x = add_right[i][1];
            this.texture_data.data[this._get_texture_idx(x,y)] = uint8(0); 
        }
        for(let i in remove_bottom){
            y = add_right[i][0];
            x = add_right[i][1];
            this.texture_data.data[this._get_texture_idx(x,y)+1] = uint8(0); 
        }
        //TODO check if this is needed
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, this.texture_data.level, this.texture_data.internalFormat, 
            this.texture_data.width, this.texture_data.height, 
            this.texture_data.border, this.texture_data.format, 
            this.texture_data.type, this.texture_data.data);

        
    }


}