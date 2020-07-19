
var gl, renderer, canvas,scene

function error(str){
    console.log(str);
}




function setup(){
    canvas = document.getElementById("c");
    canvas.width = "600";
    canvas.height = "400";
    gl = canvas.getContext("webgl2");
    if(!gl){
        error("No WEBGL");
    }

    renderer = new Renderer();
    scene = new Scene();
}


function doUIstuff(){

}

function animate(){
    doUIstuff();
    renderer.render(scene);
    //requestAnimationFrame(animate);
}



function main(){
    setup();
    requestAnimationFrame(animate);
}


main();