
function refresh_button() {
        let rr_file = document.getElementById('rr_file').files[0];
        read_file(rr_file);
    

    /*sol_file_change = false;
        let solution_file = document.getElementById('sol_file').files[0];
        start_reading_sol(solution_file);*/
}


function show(rr_board) {
	console.log(rr_board.size)
	console.log(rr_board.robots)
	console.log(rr_board.goal_position)
	console.log(rr_board.barriers_right)
	console.log(rr_board.barriers_down)
}