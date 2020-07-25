class Board {
	constructor(size, init_positions, goal_position, barriers_right, barriers_down) {
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
