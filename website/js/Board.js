class Board {
	constructor(size, init_positions, goal_position, barriers_right, barriers_down) {
		this.size = size
		this.robots = init_positions
		this.goal_position = goal_position
		this.barriers_right = barriers_right
		this.barriers_down = barriers_down
	}
}
