

class Solution {
    constructor(base_time = 0.25,timePropDistance = 1.0){
        
        this.keyframes = [this._copyKeyframe(scene.original_positions)];
        
        this.times = [0.0];
        this.moves = [];
        this.base_time = base_time;
        this.timePropDistance = timePropDistance;
        this.animationController = null;
        this._isWin = Math.floor(this.keyframes[0][scene.goal_color_str].x) == Math.floor(scene.goal.x) &&
                    Math.floor(this.keyframes[0][scene.goal_color_str].y) == Math.floor(scene.goal.y);
    }

    _copyKeyframe(keyframe){
        let kf = {};
        for(let i in keyframe){
            kf[i] = copyPos(keyframe[i]);
        }
        return kf;
    }

    addMove(move){
        let helping_positions = this._copyKeyframe(this.keyframes[this.keyframes.length-1]);
        for(let i in helping_positions){
            helping_positions[i] = makePos(Math.floor(helping_positions[i].x) +1,
            Math.floor(helping_positions[i].y) +1)
        }
        let tmp = scene.compute_move(move, helping_positions);
        console.log("Computed move: ", move, helping_positions,tmp)
        if(tmp.x == helping_positions[move.color].x &&
            tmp.y == helping_positions[move.color].y){
            console.log("invalid move");
            return;
        }
        
        this.moves.push(move);
        
        this.keyframes.push(this._copyKeyframe(this.keyframes[this.keyframes.length-1]));
        this.keyframes[this.keyframes.length-1][move.color] = makePos(tmp.x-0.5,tmp.y-0.5);

        if(scene.goal_color_str == move.color){
            this._isWin =  Math.floor(this.keyframes[this.keyframes.length-1][move.color].x) == Math.floor(scene.goal.x) &&
            Math.floor(this.keyframes[this.keyframes.length-1][move.color].y) == Math.floor(scene.goal.y);
        }
       


        
        let delta = subPos(tmp, helping_positions[move.color]);
        let t = Math.abs(delta.x)+Math.abs(delta.y);
        console.log(delta);
        t= (t*(this.timePropDistance) + 1.0*(1-this.timePropDistance))*this.base_time;
        t = Math.max(t,this.base_time);
        
        this.times.push(this.times[this.times.length-1]+t);

        if(this.animationController){
            this.animationController.replaceData(this);
            this.animationController.reset();
        }
    }

    isWin(){
        return this._isWin;
    }
    removeMove(){
        if(this.moves.length<=0){
            return;
        }
        this.moves.pop();
        this.times.pop();
        this.keyframes.pop();

        if(this.animationController)
            this.animationController.replaceData(this);
    }
}