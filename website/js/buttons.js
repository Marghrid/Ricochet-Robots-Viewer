function refresh_button() {
        let rr_file = document.getElementById('rr_file').files[0];
        read_instance_file(rr_file);
    

    /*sol_file_change = false;
        let solution_file = document.getElementById('sol_file').files[0];
        start_reading_sol(solution_file);*/
}

function example1_button() {
    get_example_file("i1");
}

function example2_button() {
    get_example_file("i2");
}

function example3_button() {
    get_example_file("i3");
}

function show_sol(solution) {
    solution.forEach(el => console.log(el))
}

function show() {
	console.log(current_board.size);
	console.log(current_board.robots);
	console.log(current_board.goal_position);
	console.log(current_board.barriers_right);
    console.log(current_board.barriers_down);


    
    let right_walls = [];
    for(let barrier in current_board.barriers_right){
        let pair = current_board.barriers_right[barrier];
        right_walls.push([pair[0]-1,pair[1]-1]);
    }
    let bottom_walls = [];
    for(let barrier in current_board.barriers_down){
        let pair = current_board.barriers_down[barrier];
        bottom_walls.push([pair[0]-1,pair[1]-1]);
    }
    let board_size = current_board.size;
    let positions={
        yellow: [current_board.robots["Y"][0]-0.5, current_board.robots["Y"][1]-0.5],
        green:  [current_board.robots["G"][0]-0.5, current_board.robots["G"][1]-0.5],
        blue:   [current_board.robots["B"][0]-0.5, current_board.robots["B"][1]-0.5],
        red:    [current_board.robots["R"][0]-0.5, current_board.robots["R"][1]-0.5],
    }
    let goal = [current_board.goal_position[1]-0.5,current_board.goal_position[2]-0.5]
    let goal_color = "red"
    switch (current_board.goal_position[0]) {
        case "R":
            goal_color = "red";
            break;
        case "G":
            goal_color = "green";
            break;
        case "B":
            goal_color = "blue";
            break;
        case "Y":
        default:
            goal_color = "yellow"
            break;
        
    }
    if (scene == null) {
        scene = new Scene(board_size,right_walls,bottom_walls,positions, goal, goal_color);
    } else {
        scene.change_board(board_size,right_walls,bottom_walls,positions,goal,goal_color)
    }
}
