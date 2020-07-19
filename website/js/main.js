
var gl, renderer, canvas,scene

function error(str){
    console.log(str);
}




function setup(){
    canvas = document.getElementById("c");
    gl = canvas.getContext("webgl");
    if(!gl){
        error("No WEBGL");
    }


    bgColor = createColor(0,0,255);

    renderer = new Renderer(bgColor);
    scene = new Scene();
}


function doUIstuff(){

}

function animate(){
    doUIstuff();
    renderer.render(scene);
    requestAnimationFrame(step);
}



function main(){
    setup();
    requestAnimationFrame(animate);
}


main();