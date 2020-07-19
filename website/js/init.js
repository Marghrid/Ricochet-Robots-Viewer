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

function show(rr_board) {
	console.log(rr_board.size)
	console.log(rr_board.robots)
	console.log(rr_board.goal_position)
	console.log(rr_board.barriers_right)
	console.log(rr_board.barriers_down)
}

function get_example_file(ex_name) {
    let rr_blob = null;
    let sol_blob = null;
    let rr_request = new XMLHttpRequest();
    let sol_request = new XMLHttpRequest();

    rr_request.open("GET", "examples/" + ex_name + ".in");
    sol_request.open("GET", "examples/" + ex_name + ".out");

    rr_request.responseType = "blob";//force the HTTP response, response-type header to be blob
    sol_request.responseType = "blob";//force the HTTP response, response-type header to be blob

    rr_request.onload = function() {
        rr_blob = rr_request.response;//rr_request.response is now a blob object
        read_file(rr_blob);

        // sol_request.onload = function() {
        //     sol_blob = sol_request.response;//sol_request.response is now a blob object
        //     start_reading_sol(sol_blob);

        // }
        // sol_request.send();

    }
    rr_request.send();
}