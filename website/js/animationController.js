class AnimationController {
    constructor(move_set,interpolationType ="linear", timePropDistance = 1.0,base_time = 0.5){
        this.times = [];
        this.colors = [];
        for(let i in move_set){
            let t = Math.abs(move_set[i].delta.x)+Math.abs(move_set[i].delta.y);
            t= (t*(timePropDistance) + 1.0*(1-timePropDistance))*base_time;
            this.times.push(t);
            switch(move_set[i].color){
                case "R":
                    this.colors.push("red");
                    break;
                case "G":
                    this.colors.push("green");
                    break;
                case "B":
                    this.colors.push("blue");
                    break;
                case "Y":
                    this.colors.push("yellow");
                    break;

                default:
                    console.log("Error: Unknown Color")
                    break;
            }
        }
        this.move_set = move_set;
        this.reset();
        
        
        switch(interpolationType){
            case "linear":
                this.interpolationFn = function(t,totalTime,a,b){
                    return t;
                }
                break;
            case "bounce":
                this.interpolationFn = function(t,totalTime,a,b){
                    let accelPeriod = 0.0;
                    let const_bounce = 0.3;

                    
                    let dist = Math.abs(a.x-b.x) + Math.abs(a.y-b.y);


                    let bouncePeriod = (1./dist)*const_bounce*2;
                    let bounceStart = 1. - bouncePeriod;
                    let bounceEnd = 1.-bouncePeriod*0.5;


                    let linearPeriod = bounceStart-accelPeriod;
                    let y = (1 -Math.sqrt(1.-2*accelPeriod*(linearPeriod)))*0.5
                    
                    if(t<accelPeriod){
                        return (t*t)/(accelPeriod*accelPeriod)*y;
                    }
                    if(t<bounceStart){
                        return y+ (t-accelPeriod)/(linearPeriod)*(1-y);
                    }
                    if(t<bounceEnd){
                        return 1.0 + (t-bounceStart)*const_bounce;
                    }
                    
                    return 1.0 + (bounceEnd-bounceStart)*const_bounce - (t-bounceEnd)*const_bounce;
                    
                    
                    return t;
                }
                break;
            default:
                error("Unknown interpolation mode")
        }
        
    }

    step(delta){
        //console.log("steping by ",delta);
        //console.log("this.idx = ", this.idx," and this.time = ", this.time);
        this.time +=delta;
        while(this.time > this.times[this.idx]){
            if(this.idx>=this.move_set.length-1){
                this.time = this.times[this.idx];
                break;
            }
            scene.robots[this.colors[this.idx]].x = this.next_pos.x;
            scene.robots[this.colors[this.idx]].y = this.next_pos.y;
            
            this.time -= this.times[this.idx];
            this.idx++;
            this.prev_pos = makePos(scene.robots[this.colors[this.idx]].x,scene.robots[this.colors[this.idx]].y);
            this.next_pos = makePos(scene.robots[this.colors[this.idx]].x + this.move_set[this.idx].delta.x,
                         scene.robots[this.colors[this.idx]].y + this.move_set[this.idx].delta.y);
        
        }

        let t = this.time/this.times[this.idx];
        t = this.interpolationFn(t,this.time[this.idx],this.prev_pos,this.next_pos);
        scene.robots[this.colors[this.idx]].x = this.prev_pos.x*(1-t) + this.next_pos.x*t;
        scene.robots[this.colors[this.idx]].y = this.prev_pos.y*(1-t) + this.next_pos.y*t;
        
    }
    
    reset(){
        for(let i in scene.robots){
            scene.robots[i].x = scene.original_positions[i].x;
            scene.robots[i].y = scene.original_positions[i].y;
        }
        this.time = 0
        this.idx = 0;
        this.prev_pos = makePos(scene.robots[this.colors[this.idx]].x,scene.robots[this.colors[this.idx]].y);
        this.next_pos = makePos(scene.robots[this.colors[this.idx]].x + this.move_set[this.idx].delta.x,
                         scene.robots[this.colors[this.idx]].y + this.move_set[this.idx].delta.y);

        
        console.log(scene.robots);

    }


}