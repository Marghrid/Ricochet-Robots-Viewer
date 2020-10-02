function read_instance_file(rr_file) {
  let rr_string;
  let rr_board;
  let reader = new FileReader();
  reader.onload = function(e) {
        
        // cpf is a string with the file's contents
        controls.loadScene = reader.result;        
    }
    reader.readAsText(rr_file);
}

function loadInstance(rr_string){
    let board = parse_rr(rr_string);
    show(board);

}

function read_solution_file(rr_file) {
  let sol_string;
  let sol;
  let reader = new FileReader();
  reader.onload = function(e) {
        controls.loadSolution = reader.result;        
    }
    reader.readAsText(rr_file);
}

function loadSolution(sol_string){
    let sol = parse_solution(sol_string);    
    animationController.replaceData(sol);
    animationController.reset();
}

function noRobotAt(position, positions){
    for(let i in positions){
        if(positions[i].x == position.x && positions[i].y == position.y){
            return false;
        }
    }
    return true;
}


function parse_solution(sol_string) {
	const colors = ['R', 'G', 'B', 'Y']
    const directions = ['u', 'd', 'l', 'r']
	let lines = sol_string.split('\n');
	let sol_size = parseInt(lines[0]);
	let tmp = [];
	for (let i = 1; i <= sol_size; ++i) {
		line = lines[i].split(' ')
		color = line[0]
		direction = line[1].trim()
		console.assert(colors.indexOf(color) >= 0, color + " not in " + colors)
		console.assert(directions.indexOf(direction) >= 0, direction + " not in " + directions)
		tmp.push([color, direction]);
    }
    
    tmp2 = new Solution();
    for(let i in tmp){
        console.log(tmp[i])
        console.log(COLOR_STL[tmp[i][0]],tmp[i][1]);
        console.log(makeMovement(COLOR_STL[tmp[i][0]],tmp[i][1]));
        tmp2.addMove(makeMovement(COLOR_STL[tmp[i][0]],tmp[i][1]));
    }
	return tmp2;
}

function parse_rr(rr_string) {
    const colors = ['R', 'G', 'B', 'Y']
    const directions = ['u', 'd', 'l', 'r']
	let lines = rr_string.split('\n');
	let board_size = parseInt(lines[0]);
	let init_positions = {};
	for (let i = 1; i <= 4; ++i) {
		let line = lines[i].split(" ");
        let row = parseInt(line[1])
        let col = parseInt(line[2])
        let color = line[0]
        console.assert(1 <= row <= board_size)
        console.assert(1 <= col <= board_size)
        console.assert(colors.indexOf(color) >= 0, color + " not in " + colors)
		init_positions[color] = [row, col];
	}

	let line_5 = lines[5].split(" ");
    let color = line_5[0]
    let row = parseInt(line_5[1])
    let col = parseInt(line_5[2])
    console.assert(1 <= row <= board_size)
    console.assert(1 <= col <= board_size)
    console.assert(colors.indexOf(color) >= 0, color + " not in " + colors)
    goal_position = [color, row, col];

    k = parseInt(lines[6])

    barriers_right = []
    barriers_down = []
    for (let i = 7; i < 7+k; ++i) {
    	let line = lines[i].split(" ")
    	let dir = line[2].trim()
        let row = parseInt(line[0])
        let col = parseInt(line[1])
        console.assert(directions.indexOf(dir) >= 0, dir + " not in " + directions)
        console.assert(1 <= row <= board_size)
        console.assert(1 <= col <= board_size)
    	if (dir === 'l') {
    		barriers_right.push([row, col-1])
    	}
    	else if (dir === 'r') {
    		barriers_right.push([row, col])
    	}
    	else if (dir === 'u') {
    		barriers_down.push([row-1, col])
    	}
    	else if (dir === 'd') {
    		barriers_down.push([row, col])
    	}
    }
    
    return new Board(board_size, init_positions, goal_position, barriers_right, barriers_down)
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
        rr_blob = rr_request.response; //rr_request.response is now a blob object
        read_instance_file(rr_blob);

            sol_request.onload = function() {
        	sol_blob = sol_request.response; //sol_request.response is now a blob object
        	read_solution_file(sol_blob);

        }
        sol_request.send();

    }
    rr_request.send();
}