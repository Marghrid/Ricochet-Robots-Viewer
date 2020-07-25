var current_board = null;
var current_sol = null;

function read_instance_file(rr_file) {
  let rr_string;
  let rr_board;
  let reader = new FileReader();
  reader.onload = function(e) {
        
        // cpf is a string with the file's contents
        rr_string = reader.result;

        //TODO this should not be here
        current_sol = null;
        controls.loadAnim = true;

        current_board = parse_rr(rr_string);
        show();
    }
    reader.readAsText(rr_file);
}

function read_solution_file(rr_file) {
  let sol_string;
  let sol;
  let reader = new FileReader();
  reader.onload = function(e) {
        // cpf is a string with the file's contents
        sol_string = reader.result;
        if(current_board!=null)
            current_sol = parse_solution(sol_string);
        else
            error("No current board");
    }
    reader.readAsText(rr_file);
}

function noRobotAt(position, positions){
    for(let i in positions){
        if(positions[i][0] == position[0] && positions[i][1] == position[1]){
            return false;
        }
    }
    return true;
}
function copyPos(pos){
    return [pos[0],pos[1]];
}
function compute_move(move, positions){
    
    let current_pos = copyPos(positions[move[0]]);
    //delta  is (index, sign);
    let delta = [0,0];
    switch(move[1]){
        case "r":
            delta = [1,1];
            break;
        case "l":
            delta = [1,-1];
            break;
        case "u":
            delta = [0,-1];
            break;
        case "d":
            delta = [0,1];  
            break;
        default:  
            error("Error in direction")        
            break;
    }
    
    while(true){
        let new_pos = copyPos(current_pos);
        console.log(new_pos,current_board.size);
        new_pos[delta[0]] += delta[1];
        if(!noRobotAt(new_pos,positions))
            break;
        if( new_pos[0]<=0 && move[1] == "u" ||
            new_pos[1]<=0 && move[1] == "l" || 
            new_pos[1]>current_board.size && move[1] == "r" || 
            new_pos[0] > current_board.size && move[1] == "d")
            break;
        if(delta[0] == 0){
            if(delta[1]>0){
                if(current_board.barriers_down_dict[current_pos]){
                    break;
                }
            } else {
                if(current_board.barriers_down_dict[[current_pos[0]-1,current_pos[1]]]){
                    break;
                }
            }
        } else /*horizontal*/{
            if(delta[1]>0){
                if(current_board.barriers_right_dict[current_pos]){
                    break;
                }
            } else {
                if(current_board.barriers_right_dict[[current_pos[0],current_pos[1]-1]]){
                    break;
                }
            }
        }
        current_pos = copyPos(new_pos);
    }
    /*
    console.log("Computed move: ",move)
    console.log("started: ",positions[move[0]])
    console.log("ended: ",current_pos)
    */
    return current_pos;
}

function parse_solution(sol_string) {
	const colors = ['R', 'G', 'B', 'Y']
    const directions = ['u', 'd', 'l', 'r']
	let lines = sol_string.split('\n');
	let sol_size = parseInt(lines[0]);
	tmp = [];
	for (let i = 1; i <= sol_size; ++i) {
		line = lines[i].split(' ')
		color = line[0]
		direction = line[1].trim()
		console.assert(colors.indexOf(color) >= 0, color + " not in " + colors)
		console.assert(directions.indexOf(direction) >= 0, direction + " not in " + directions)
		tmp.push([color, direction]);
    }
    positions = {
        R: current_board.robots["R"],
        G: current_board.robots["G"],
        Y: current_board.robots["Y"],
        B: current_board.robots["B"],
    }
    tmp2 = [];
    for(let i in tmp){
        let old = positions[tmp[i][0]]
        positions[tmp[i][0]] = compute_move(tmp[i], positions);
        tmp2.push({
            color: tmp[i][0],
            delta: makePos(positions[tmp[i][0]][0]-old[0], positions[tmp[i][0]][1]-old[1])
        })

    }

    console.log("solution: ",tmp2);
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