function refresh_button() {
        let rr_file = document.getElementById('rr_file').files[0];
        read_instance_file(rr_file);
    

    /*sol_file_change = false;
        let solution_file = document.getElementById('sol_file').files[0];
        start_reading_sol(solution_file);*/
}

function example0_button() {
    get_example_file("i0");
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

function show(board) {
	console.log(board.size);
	console.log(board.robots);
	console.log(board.goal_position);
	console.log(board.barriers_right);
    console.log(board.barriers_down);


    
    let right_walls = [];
    for(let barrier in board.barriers_right){
        let pair = board.barriers_right[barrier];
        right_walls.push([pair[0]-1,pair[1]-1]);
    }
    let bottom_walls = [];
    for(let barrier in board.barriers_down){
        let pair = board.barriers_down[barrier];
        bottom_walls.push([pair[0]-1,pair[1]-1]);
    }
    let board_size = board.size;
    let positions={
        yellow: [board.robots["Y"][0]-0.5, board.robots["Y"][1]-0.5],
        green:  [board.robots["G"][0]-0.5, board.robots["G"][1]-0.5],
        blue:   [board.robots["B"][0]-0.5, board.robots["B"][1]-0.5],
        red:    [board.robots["R"][0]-0.5, board.robots["R"][1]-0.5],
    }
    let goal = [board.goal_position[1]-0.5,board.goal_position[2]-0.5]
    let goal_color = "red"
    switch (board.goal_position[0]) {
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
    if(scene!=null){
        scene.change_board(board_size,right_walls,bottom_walls,positions,goal,goal_color);   
    } else {
        scene = new Scene(board_size,right_walls,bottom_walls,positions, goal, goal_color);
    }
    if(animationController)
        animationController.replaceData(new Solution());
}
