
var gl, renderer, canvas,scene,clock, time;

function error(str){
    console.log(str);
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



function setup(){
    canvas = document.getElementById("c");
    canvas.width = "600";
    canvas.height = "400";
    gl = canvas.getContext("webgl2",);
    if(!gl){
        error("No WEBGL");
    }

    renderer = new Renderer();



    let right_walls = [[1,4],[5,6],[2,5],[2,6],[3,5],[3,6]];
    let bottom_walls = [[0,0],[6,0],[2,6],[2,7],[3,6],[3,7]];
    let board_size = 8;
    let positions={
        yellow: [0.5,0.5],
        green:  [0.5,2.5],
        blue:   [2.5,0.5],
        red:    [2.5,2.5],
    }
    let goal = [1.5,1.5]
    let goal_color = "red"
    scene = new Scene(board_size,right_walls,bottom_walls,positions, goal, goal_color);
    clock = new Clock();
    time = 0;
}


function doUIstuff(){

}

function animate(){
    delta = clock.getDelta();
    if(time>-1)
        time += delta;
    doUIstuff();
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
    renderer.render(scene);
    requestAnimationFrame(animate);
}



function main(){
    setup();
    requestAnimationFrame(animate);
}


main();