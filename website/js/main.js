
var gl, renderer, canvas,scene,clock, time,state;
var animationController = null;
function error(str){
    console.log(str);
}

class State{
    constructor(){
        this.buttons = {
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
        this.buttons[this.current_state].classList.add("active")
    }

    activateView(){
        this._activate("view");
    }
    activatePlay(){
        this._activate("play");
    }

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
    canvas.style.width = x;
    canvas.style.height = y>x?x:y;
    
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




function setup(){
    setupControls();

    canvas = document.getElementById("c");
    
    

    
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
    state.buttons["play"].onclick = function(){
        state.activatePlay();
    }
    state.buttons["view"].onclick = function(){
        state.activateView();
    }
}


function doUIstuff(){

}


function animate(){
    delta = clock.getDelta();
    doUIstuff();

    if(state.current_state=="view"){
    //if(time>-1)
    //    time += delta;
        if(controls.loadAnim){
            if(current_sol != null && scene != null){
                animationController = new AnimationController(current_sol, "linear",1.0,0.2);
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