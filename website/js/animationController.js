class AnimationController {
    constructor(solution,interpolationType ="linear"){
        this.solution = solution;
        console.log(this.solution);
        this.solution.animationController = this;
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
                    
                    
                    //return t;
                }
                break;
            default:
                error("Unknown interpolation mode")
        }
        
    }
    seek(time){
        //do binary search
        /*if(time <= this.solution.times[0]){
            this.time = this.solution.times[0];
            this.idx = 0;
            return;
        }
        if(time >= this.solution.times[this.solution.times.length-1]){
            this.time = this.solution.times[this.solution.times.length-1];
            this.idx = this.solution.times.length-2;
            return;
        }*/
        
        let tmp_idx = Math.floor((this.solution.times.length-1)/2);
        this.time = time;
        if(this.time<=this.solution.times[0]){
            this.time =this.solution.times[0];
            this.idx = 0;
        } else if(this.time>=this.solution.times[this.solution.times.length-1]){
            this.time =this.solution.times[this.solution.times.length-1];
            this.idx = Math.max(this.solution.times.length-2,0);
        } else while(true){
            if(time<=this.solution.times[tmp_idx+1] && time>=this.solution.times[tmp_idx]){
                break;
            }
            if(time > this.solution.times[tmp_idx+1]){
                tmp_idx = Math.floor((this.solution.times.length-1 + tmp_idx)/2);
            } else /*time < this.solution.times[tmps_idx]*/{
                tmp_idx = Math.floor(tmp_idx/2);                
            }
        }
        this.step(0);
    }

    replaceData(solution){
        /* Make sure time isn't overflowing */
        this.solution = solution;
        this.solution.animationController = this;
        console.log("seeking: ", this.time);
        this.seek(this.time);
        //TODO ???? maybe done?
    }

   

    step(delta){
       this.time +=delta;
        
        if(this.solution.times.length <2){
            this.idx = 0;
            this.time = this.solution.times[0];
        }
        //else
        while(this.time > this.solution.times[this.idx+1]){
            this.idx++;
            //console.log(this.idx);
            if(this.idx>this.solution.times.length-2){;
                
                this.idx = Math.max(0,this.solution.times.length-2);
                this.time = this.solution.times[this.solution.times.length-1];
                break;
            }
        
        }
        //else
        while(this.time < this.solution.times[this.idx]){
            console.log("hmmm?");
            this.idx--;
            if(this.idx<0){
                this.idx = 0;
                this.time = this.solution.times[0];
                break;
            }
        }
        
        
        for(let i in scene.robots){
            let tmp =  makePos(this.solution.keyframes[this.idx][i].x,this.solution.keyframes[this.idx][i].y);
            scene.robots[i].x = tmp.x;
            scene.robots[i].y = tmp.y;
        }

        if(this.solution.moves.length>0){
            //console.log("steping by ",delta);
            //console.log("this.idx = ", this.idx," and this.time = ", this.time);
            
            
            

            let color = this.solution.moves[this.idx].color;
            let prev_pos = this.solution.keyframes[this.idx][color];
            let next_pos = this.solution.keyframes[this.idx+1][color];
            let t = (this.time-this.solution.times[this.idx])/(this.solution.times[this.idx+1] -this.solution.times[this.idx]);
            
            t = this.interpolationFn(t,(this.solution.times[this.idx+1] -this.solution.times[this.idx]),prev_pos,next_pos);
            
            
            let tmp = addPos(
                        scalePos(prev_pos,1-t), 
                        scalePos(next_pos,t));
            scene.robots[color].x = tmp.x;
            scene.robots[color].y = tmp.y;
        }
    }
    
    reset(){
        for(let i in scene.robots){
            scene.robots[i].x = this.solution.keyframes[0][i].x;
            scene.robots[i].y = this.solution.keyframes[0][i].y;
        }
        this.time = this.solution.times[0];
        this.idx = 0;

    }


}