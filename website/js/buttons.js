function refresh_button() {
        let rr_file = document.getElementById('rr_file').files[0];
        read_file(rr_file);
    

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

function show(rr_board) {
	console.log(rr_board.size);
	console.log(rr_board.robots);
	console.log(rr_board.goal_position);
	console.log(rr_board.barriers_right);
    console.log(rr_board.barriers_down);


    
    let right_walls = [];
    for(let barrier in rr_board.barriers_right){
        let pair = rr_board.barriers_right[barrier];
        right_walls.push([pair[0]-1,pair[1]-1]);
    }
    let bottom_walls = [];
    for(let barrier in rr_board.barriers_down){
        let pair = rr_board.barriers_down[barrier];
        bottom_walls.push([pair[0]-1,pair[1]-1]);
    }
    let board_size = rr_board.size;
    let positions={
        yellow: [rr_board.robots["Y"][0]-0.5, rr_board.robots["Y"][1]-0.5],
        green:  [rr_board.robots["G"][0]-0.5, rr_board.robots["G"][1]-0.5],
        blue:   [rr_board.robots["B"][0]-0.5, rr_board.robots["B"][1]-0.5],
        red:    [rr_board.robots["R"][0]-0.5, rr_board.robots["R"][1]-0.5],
    }
    let goal = [rr_board.goal_position[1]-0.5,rr_board.goal_position[2]-0.5]
    let goal_color = "red"
    switch (rr_board.goal_position[0]) {
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
