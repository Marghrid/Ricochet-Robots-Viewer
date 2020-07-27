
var gl, renderer, canvas,scene,clock, time,state;
var animationController = null;
var animControlsParams = {
    interpolationType: "linear",
            timePropDistance: 1.0,
            base_time: 0.2
    
};
var playMoves = [];
function error(str){
    console.log(str);
}

var grabbed = null;

var touchPos = null;


class State{
    constructor(){
        this.buttons = {
            create: document.getElementById("create_button"),
            play: document.getElementById("play_button"),
            view: document.getElementById("view_button")
        }
        this.current_state = null
    }

    _activate(state){
        controls.resetAnim = true;
        if(this.current_state!=null){
            this.buttons[this.current_state].classList.remove("active");
        }
        this.current_state = state
        this.buttons[this.current_state].classList.add("active");
    }

    activateView(){
        let op = document.getElementById("options");
        op.innerHTML = `
        <h4>load example</h4>
			  <div id="example_buttons_div">
				<button type="button" class="example_button" onclick="example1_button()"> grid 5x5 </button>
				<button type="button" class="example_button" onclick="example2_button()"> grid 6x6 </button>
				<button type="button" class="example_button" onclick="example3_button()"> grid 8x8 </button>
			  </div>
		
			<h4>or</h4>
			<div id="file_load_div">
				<input type="file" id="rr_file"  class="inputfile" >
				<label for="rr_file">upload instance</label>
				<input type="file" id="sol_file"  class="inputfile" >
				<label for="sol_file">upload solution</label>
				
				<!--<button type="button" id="refresh_button" onclick="refresh_button()"> Refresh </button></p>-->
            </div>
        `
        this._activate("view");
    }
    
    activatePlay(){
        
        let op = document.getElementById("options");
        op.innerHTML = `
        <button type="button" class="example_button" onclick="noop()"> save solution </button>
        <h4>load example</h4>
        <div id="example_buttons_div">
          <button type="button" class="example_button" onclick="example1_button()"> grid 5x5 </button>
          <button type="button" class="example_button" onclick="example2_button()"> grid 6x6 </button>
          <button type="button" class="example_button" onclick="example3_button()"> grid 8x8 </button>
        </div>
  
      <h4>or</h4>
        <div id="file_load_div">
            <input type="file" id="rr_file"  class="inputfile" >
            <label for="rr_file">upload instance</label>          
            <!--<button type="button" id="refresh_button" onclick="refresh_button()"> Refresh </button></p>-->
            </div>
        `;
        this._activate("play");
        
    }
    activateCreate(){
        
        let op = document.getElementById("options");
        op.innerHTML = `
        <button type="button" class="example_button" onclick="noop()"> save instance </button>
        <h4>creator tools</h4>
        <label for="board_size">Board size</label>
        
        <input type="number" id="board_size" name="board_size" min=3 onchange="board_size_input()"><br><br>
        <button type="button" class="example_button" onclick="scene.toggle_goal_color()">toggle goal color</button>
       
        <h4>how to</h4>
        <p>hold LMB over a robot/goal to move it.<p>
        <p>press LMB over a wall to activate/deactivate it.<p>
        
        
        `
        let a = document.getElementById("board_size");
        a.value = scene.board_size;

        this._activate("create");
    }

}

function board_size_input(){
    let a = document.getElementById("board_size");
    let size = a.value;
    let positions = {
        red: [0.5,0.5],
        blue: [0.5,size-0.5],
        green: [size-0.5, size-0.5],
        yellow: [size-0.5,0.5]
    }
    let goal_position = [Math.floor(size*0.5) + 0.5,Math.floor(size*0.5)+0.5];
    scene.change_board(Math.floor(size),[],[],positions,goal_position,"red");
}


class Clock{
    constructor(){
        this.time = Date.now();
    }
    getDelta(){
        let oldTime = this.time;
        this.time = Date.now();
        return 0.001*(this.time-oldTime);
    }
}

var hq = true;

function toggle_quality(){
    let x = canvas.clientWidth;
    let y = canvas.clientHeight;
    y = y>x?x:x*0.9;
    canvas.style.width = x;
    canvas.style.height = y;
    
    x *= window.devicePixelRatio;
    y *= window.devicePixelRatio;
    
    if(!hq){
        hq = true;
        x=x*2;
        y=y*2
        canvas.height = y.toString();
        canvas.width = x.toString(); 
    } else {
        hq = false;
        canvas.height = y.toString();
        canvas.width = x.toString();
    }
    
    console.log(canvas.height)
    renderer.updateResolution();
}

function computeBarrier(pos){
    let proxy_gw = scene.grid_width;
    proxy_gw*=8;
    let help_pos = {x:pos.x-proxy_gw, 
                    y:pos.y-proxy_gw};
    let int_pos = {x:Math.floor(help_pos.x), 
                    y:Math.floor(help_pos.y)};
    
    let real_int_pos = {
        x:Math.floor(pos.x),
        y:Math.floor(pos.y)
    }
    help_pos.x -=int_pos.x;
    help_pos.y -= int_pos.y;

    
    
    if(help_pos.y > 1-2*proxy_gw){
        if(int_pos.y >= 0 && int_pos.y<scene.board_size-1
            && real_int_pos.x>=0 && real_int_pos.x <scene.board_size)
                return {direction: "h", coord: [real_int_pos.x,int_pos.y]}
    }

    
    if(help_pos.x > 1-2*proxy_gw){
        if(int_pos.x >= 0 && int_pos.x<scene.board_size-1
            && real_int_pos.y>=0 && real_int_pos.y <scene.board_size)
                return {direction: "v", coord: [int_pos.x,real_int_pos.y]}
    }
    return null;
}

function grabObject(mousePos){
    let intMousePos = {x:Math.floor(mousePos.x),y:Math.floor(mousePos.y)}
    
    for(let i in scene.robots){
        if(Math.floor(scene.robots[i].x) == intMousePos.x && 
            Math.floor(scene.robots[i].y) == intMousePos.y){
                grabbed = {id: i, 
                           pos: {x:Math.floor(scene.robots[i].x),
                                 y:Math.floor(scene.robots[i].y) }
                };
            }
    
    }
    if(grabbed==null && 
        Math.floor(scene.goal.x) == intMousePos.x && 
        Math.floor(scene.goal.y) == intMousePos.y){
        grabbed = {id: "goal", 
                 pos: {x:Math.floor(scene.goal.x),y:Math.floor(scene.goal.y)}};
    }
    console.log("grabbed:",grabbed);

}
function dropObject(mousePos){
    //TODO: check if dropping on top of something
    if(grabbed == null)
        return;

    let pos = {x:Math.floor(mousePos.x),y:Math.floor(mousePos.y)}
    if(pos.x<0 || pos.y<0 || pos.x>=scene.board_size||pos.y>=scene.board_size){
        pos.x = grabbed.pos.x;
        pos.y = grabbed.pos.y;
    }
     
    if(grabbed.id == "goal"){
        
        scene.goal.x = pos.x+0.5;
        scene.goal.y = pos.y+0.5;
        grabbed = null;
        return;  
    }

    for(let i in scene.original_positions){
          if(pos.x == Math.floor(scene.original_positions[i].x) &&
            pos.y == Math.floor(scene.original_positions[i].y) ){
            pos.x = grabbed.pos.x;
            pos.y = grabbed.pos.y;
            break;
        }
    }
    
    scene.original_positions[grabbed.id].x = pos.x+0.5;
    scene.original_positions[grabbed.id].y =pos.y+0.5;
    scene.robots[grabbed.id].x = pos.x+0.5;
    scene.robots[grabbed.id].y =pos.y+0.5;
    grabbed = null;
}

function computeMousePos(mp){
    
    let rect = canvas.getBoundingClientRect();
    let mousePos = {x:mp.x,y:mp.y};
    mousePos.x -=rect.left;
    mousePos.y -= rect.top;
    mousePos.x/=(rect.right-rect.left);
    mousePos.y/=(rect.bottom-rect.top);
    mousePos.x = mousePos.x*2-1;
    mousePos.y = -(mousePos.y*2-1);

    mousePos.x*=renderer.aspect_ratio;
    mousePos.x/=scene.v_zoom;
    mousePos.y/=scene.v_zoom;
    mousePos.x+=scene.center[1];
    mousePos.y+=scene.center[0];
    let tmp = mousePos.x;
    mousePos.x = scene.board_size - mousePos.y;
    mousePos.y = tmp;
   // console.log(Math.floor(mousePos.x),Math.floor(mousePos.y));
    return mousePos;

}
function mousedowncanvas(mp){
    
    if(state.current_state=="create"){
        
        let mousePos = computeMousePos(mp)
        dropObject(mousePos)
        let barrier = computeBarrier(mousePos);
        console.log(barrier);
        if(barrier != null ){
            console.log(barrier.coord);
            /*if(barrier.direction =="h")
                scene._updateTexture([barrier.coord],[],[],[]);
            else
                scene._updateTexture([],[barrier.coord],[],[]);
            */
            if(barrier.direction =="h")
                scene.toggleTexture([barrier.coord],[]);
            else
                scene.toggleTexture([],[barrier.coord]);
        
        } else {
            grabObject(mousePos)
        }


    }
}

function mouseupcanvas(mp){
    let rect = canvas.getBoundingClientRect();
    if(state.current_state=="create"){
        
        let mousePos = computeMousePos(mp)
        dropObject(mousePos)

    }
}
function mousemovecanvas(mp){
    if(grabbed!=null){
        let rect = canvas.getBoundingClientRect();
        if(state.current_state=="create"){
        
            let mousePos = computeMousePos(mp)
            if(grabbed.id == "goal"){
                scene.goal.x = mousePos.x;
                scene.goal.y = mousePos.y;
                return;
            }
            scene.robots[grabbed.id].x = mousePos.x;
            
            scene.robots[grabbed.id].y = mousePos.y;
        
        
        }
        
    }
}

function getPosFromMouse(event){
    return {x:event.clientX,y:event.clientY};
}

function getPosFromTouch(event){
    touchPos = {x:event.touches[0].clientX,y:event.touches[0].clientY};
}

function setup(){
    setupControls();

    canvas = document.getElementById("c");
    canvas.onmousedown = function(event){
            mousedowncanvas(getPosFromMouse(event));
        };
    canvas.onmouseup = function(event){
        mouseupcanvas(getPosFromMouse(event));
    };
    canvas.onmousemove = function(event){
        mousemovecanvas(getPosFromMouse(event));
    };
    canvas.ontouchstart = function(event){
        event.preventDefault();
        getPosFromTouch(event);
        mousedowncanvas(touchPos);
    };
    canvas.ontouchend =function(event){
        event.preventDefault();
        mouseupcanvas(touchPos);
    };
    canvas.ontouchmove =function(event){
        event.preventDefault();
        getPosFromTouch(event);
        mousemovecanvas(touchPos);
    };

    
    gl = canvas.getContext("webgl2",);
    if(!gl){
        error("No WEBGL");
    }


    renderer = new Renderer();
    

    //NOTE: This is necessary for init
    toggle_quality();
    
    
    //console.log(canvas.height,canvas.width)


    hello_files = ["hi", "hello", "hey"]
    let hello_file = hello_files[Math.floor(Math.random() * hello_files.length)];
    get_example_file(hello_file);
    // let right_walls = [[1,4],[5,6],[2,5],[2,6],[3,5],[3,6]];
    // let bottom_walls = [[0,0],[6,0],[2,6],[2,7],[3,6],[3,7]];
    // let board_size = 8;
    // let positions={
    //     yellow: [0.5,0.5],
    //     green:  [0.5,2.5],
    //     blue:   [2.5,0.5],
    //     red:    [2.5,2.5],
    // }
    // let goal = [1.5,1.5]
    // let goal_color = "red"

    scene = null; // new Scene(board_size,right_walls,bottom_walls,positions, goal, goal_color);
    clock = new Clock();
    time = 0;



    state=new State();
    setupButtons()
}

function setupButtons(){
    state.buttons["create"].onclick = function(){
        state.activateCreate();
    }
    state.buttons["play"].onclick = function(){
        state.activatePlay();
    }
    state.buttons["view"].onclick = function(){
        state.activateView();
    }
}


function doUIstuff(){

}

function runAnimation(delta){
    if(controls.loadAnim){
        if(current_sol != null && scene != null){
            animationController = new AnimationController(current_sol, 
                                                    animControlsParams.interpolationType,
                                                    animControlsParams.timePropDistance,
                                                    animControlsParams.base_time);
            animationController.step(controls.animStartTime);
            controls.loadAnim = false;
        }
    } else {
        if(controls.resetAnim){
            animationController.reset();
            controls.resetAnim = false;
        }
    if(controls.playAnim){
        animationController.step(delta);
    }
    }
    
}
function animate(){
    delta = clock.getDelta();
    doUIstuff();

    if(state.current_state=="view"){
    //if(time>-1)
    //    time += delta;
        runAnimation(delta);
        
    } else if(state.current_state=="play" && 0){
        if(currentMoves.empty)
            runAnimation(0);
        else
            runAnimation(delta);
        
        if(controls.rewind){
            controls.rewind = false;
            if(!currentMoves.empty){
                playMoves.pop();
                animationController = new AnimationController(playMoves, 
                                        animControlsParams.interpolationType,
                                        animControlsParams.timePropDistance,
                                        animControlsParams.base_time);
                let cumTime = 0;
                for(let i in animationController.times){
                    cumTime += animationController.times[i];
                }
                animationController.step(cumTime);
            }
        }
        if(controls.move!=null){
            let cumTime = 0;
            for(let i in animationController.times){
                cumTime += animationController.times[i];
            }

            playMoves.push(/*todo: compute the next move)*/)
            animationController = new AnimationController(playMoves, 
                animControlsParams.interpolationType,
                animControlsParams.timePropDistance,
                animControlsParams.base_time);

            animationController.step(cumTime);

        }

    } else if(state.current_state=="create") {
        
    }
    
    
    /*if(time>6){
        
        let right_walls = [[1,4],[5,6],[2,5],[2,6],[3,5],[3,6]];
        let bottom_walls = [[0,0],[6,0],[2,6],[2,7],[3,6],[3,7]];
        let size = 12;
        let positions={
            yellow: [0.5,0.5],
            green:  [0.5,2.5],
            blue:   [2.5,0.5],
            red:    [2.5,2.5],
        }
        let goal = [1.5,0.5];
        let goal_color = "yellow";
        
        time=-10;
        scene.change_board(size,right_walls,bottom_walls,positions,goal,goal_color)
    }*/
    
    renderer.render();
    requestAnimationFrame(animate);
}



function main(){
    setup();

    requestAnimationFrame(animate);
}


main();