function createColor(r,g,b){
    return [r/255.0,g/255.0,b/255.0];
}

function makeMovement(color,direction){
    return {color:color,direction:direction};
}

function makePos(a,b){
    return {x:a, y:b}
}
function addPos(a,b){
    return {x:a.x+b.x, y:a.y+b.y};
}

function subPos(a,b){
    return {x:a.x-b.x, y:a.y-b.y};
}

function copyPos(pos){
    return {x:pos.x,y:pos.y};
}
function scalePos(a,t){    
    return {x:a.x*t, y:a.y*t};
}
function noop(){
    return;
}
//color short to long dict
var COLOR_STL = {
    R: "red",
    G: "green",
    Y:"yellow",
    B: "blue"
};

var COLOR_LTS = {
    red: "R",
    blue: "B",
    green: "G",
    yellow: "Y"
}
