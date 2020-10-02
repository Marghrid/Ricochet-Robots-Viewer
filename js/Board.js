class Board {
	constructor(size=3, init_positions = {R: [1,1],G:[1,3],B:[3,3], Y:[3,1]},
						 goal_position = ["Y", 2,2], barriers_right = [], barriers_down=[]) {
		this.size = size
		this.robots = init_positions
		this.goal_position = goal_position
		this.barriers_right = barriers_right
		this.barriers_down = barriers_down

		this.barriers_down_dict = {}
		this.barriers_right_dict = {}

		for(let i in barriers_down){
			this.barriers_down_dict[barriers_down[i]] = true;
		}
		for(let i in barriers_right){
			this.barriers_right_dict[barriers_right[i]] = true;
		}
	}
}
