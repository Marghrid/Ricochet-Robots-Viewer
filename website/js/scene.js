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
    constructor(board_size,right_walls,bottom_walls,positions, goal,goal_color){
        this.bgColor=createColor(240,240,240);
        this.board_color = createColor(240,240,240);
        this.grid_color  = createColor(180,180,180);
        this.wall_color  = createColor(30,30,30);
        this.grid_width = 0.02;
        this.colors = {

            yellow:createColor(255,198, 41),
            green: createColor(  0,168,  6),
            blue:  createColor(  0,127,212),
            red:   createColor(240, 31, 87) 
        }       
        this.robots = {};
        

        this.robot_src = ["robots/robot1.png","robots/robot2.png","robots/robot3.png","robots/robot4.png"]
        this.goal_src ="robots/goal2.png";


        var size = 0.9;
        this.original_positions ={
            yellow:{},
            green:{},
            blue:{},
            red:{},
        }
        this.original_positions.yellow.x = positions.yellow[0];
        this.original_positions.yellow.y = positions.yellow[1];
        
        this.original_positions.green.x = positions.green[0];
        this.original_positions.green.y = positions.green[1];


        this.original_positions.blue.x = positions.blue[0];
        this.original_positions.blue.y = positions.blue[1];

        this.original_positions.red.x = positions.red[0];
        this.original_positions.red.y = positions.red[1];     

        this.robots.yellow = new TexturedObj(positions.yellow[0],positions.yellow[1],size,this.colors.yellow,this.robot_src[0]);
        this.robots.green = new TexturedObj(positions.green[0],positions.green[1],size,this.colors.green,this.robot_src[1]);
        this.robots.blue = new TexturedObj(positions.blue[0],positions.blue[1],size,this.colors.blue,this.robot_src[2]);
        this.robots.red = new TexturedObj(positions.red[0],positions.red[1],size,this.colors.red,this.robot_src[3]);
        this.goal = new TexturedObj(1.5,1.5,size,this.colors[goal_color], this.goal_src);
        this.goal_color_str = goal_color;

        

        this._createTexture();
        this.change_board(board_size,right_walls,bottom_walls,positions,goal,goal_color); 

    }
    getBarriers(){
        let barriers = [];
        for(let i = 0; i<scene.board_size; i++){
            for(let j = 0; j<scene.board_size; j++){
                //j is horizontal coord
                //if is not last
                let xy = this._convert_coordinates([i,j]);
                let x = xy[0];
                let y = xy[1];
                if(j<scene.board_size-1){                
                    if(this.texture_data.data[this._get_texture_idx(x,y)]>100){
                        barriers.push({
                            direction: "h",
                            pos: {x:i,y:j}
                        })
                    }
                }
                if(i<scene.board_size-1){                
                    if(this.texture_data.data[this._get_texture_idx(x,y)+1]>100){
                        barriers.push({
                            direction: "v",
                            pos: {x:i,y:j}
                        })
                    }
                }
            }
        }
        return barriers;
    }
    changeOriginalPositions(positions){
        this.original_positions.yellow.x = positions.yellow[0];
        this.original_positions.yellow.y = positions.yellow[1];
        
        this.original_positions.green.x = positions.green[0];
        this.original_positions.green.y = positions.green[1];

        this.original_positions.blue.x = positions.blue[0];
        this.original_positions.blue.y = positions.blue[1];

        this.original_positions.red.x = positions.red[0];
        this.original_positions.red.y = positions.red[1];  
    }
    
    isGoal(){
        return (Math.floor(this.robots[this.goal_color_str].x)
                    == Math.floor(this.goal.x) &&
                    Math.floor(this.robots[this.goal_color_str].y)
                        == Math.floor(this.goal.y));
    }

    compute_move(movement){
        //TODO!

    }

    change_board(board_size, right_walls, bottom_walls,positions,goal,goal_color){
        this.board_size = board_size;
        this.center = [this.board_size/2,this.board_size/2];
        this.v_zoom = 2/(this.board_size+6*this.grid_width);

        this.goal_color_str = goal_color;
        this.changeOriginalPositions(positions);
        this.resetPositions(); 


        this.goal.x = goal[0];
        this.goal.y = goal[1];
        this.goal.color = this.colors[goal_color];

        this._change_data_size(board_size);
        this._updateTexture(right_walls,bottom_walls,[],[]);
    }
    toggle_goal_color(){

        let ngc = null;
        let stop = false;
        for(let i in this.colors){
            if(stop){
                ngc = i;
                break;
            }
            if(this.goal_color_str == i){
                stop = true;
            }
        }
        if (ngc == null)
            ngc = Object.keys(this.colors)[0];
        
        this.set_goal_color(ngc);
    }

    set_goal_color(str){
        this.goal_color_str = str;
        this.goal.color = this.colors[str];
    }

    resetPositions(){
        this.robots.yellow.x = this.original_positions.yellow.x;
        this.robots.yellow.y = this.original_positions.yellow.y;
        
        this.robots.green.x = this.original_positions.green.x;
        this.robots.green.y = this.original_positions.green.y;


        this.robots.blue.x = this.original_positions.blue.x;
        this.robots.blue.y = this.original_positions.blue.y;

        
        this.robots.red.x = this.original_positions.red.x;
        this.robots.red.y = this.original_positions.red.y;
    }

    _createTexture(){
        this.texture = gl.createTexture();
        this.texture_data = {}
        this.texture_data.level = 0;
        this.texture_data.internalFormat = gl.RGB;
        this.texture_data.border = 0;
        this.texture_data.format = gl.RGB;
        this.texture_data.type = gl.UNSIGNED_BYTE;           
    }
    _change_data_size(size){
        this.texture_data.width = size;
        this.texture_data.height = size;

        this.texture_data.data = new Uint8Array(3*this.texture_data.width*this.texture_data.height);
        
        for(let i in this.texture_data.data){
            this.texture_data.data[i] = 0;
        }
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
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
    toggleTexture(right,bottom){
        for(let i in right){
            let xy = this._convert_coordinates(right[i]);
            let x = xy[0];
            let y = xy[1];
            let idx = this._get_texture_idx(x,y)
            this.texture_data.data[idx] = this.texture_data.data[idx]>100?0:255;
        }
        for(let i in bottom){
            let xy = this._convert_coordinates(bottom[i]);
            let x = xy[0];
            let y = xy[1];
            let idx = this._get_texture_idx(x,y)
            this.texture_data.data[idx+1] = this.texture_data.data[idx+1]>100?0:255;
        }
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
        gl.texImage2D(gl.TEXTURE_2D, this.texture_data.level, this.texture_data.internalFormat, 
            this.texture_data.width, this.texture_data.height, 
            this.texture_data.border, this.texture_data.format, 
            this.texture_data.type, this.texture_data.data);
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