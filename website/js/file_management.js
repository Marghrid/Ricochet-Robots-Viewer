function read_file(rr_file) {
  let rr_string;
  let rr_board;
  let reader = new FileReader();
  reader.onload = function(e) {
        // cpf is a string with the file's contents
        rr_string = reader.result;
        rr_board = parse_rr(rr_string);
        show(rr_board);
    }
    reader.readAsText(rr_file);
}

function parse_rr(rr_string) {
	let lines = rr_string.split('\n');
	let board_size = parseInt(lines[0]);
	let init_positions = {};
	for (let i = 1; i <= 5; ++i) {
		let line = lines[i].split(" ");
        let row = parseInt(line[1])
        let col = parseInt(line[2])
        console.assert(1 <= row <= board_size)
        console.assert(1 <= col <= board_size)
		init_positions[line[0]] = [row, col];
	}

	let line_5 = lines[5].split(" ");
    let row = parseInt(line_5[1])
    let col = parseInt(line_5[2])
    console.assert(1 <= row <= board_size)
    console.assert(1 <= col <= board_size)
    goal_position = line_5;

    k = parseInt(lines[6])

    barriers_right = []
    barriers_down = []
    for (let i = 7; i < 7+k; ++i) {
    	let line = lines[i].split(" ")
    	dir = line[2]
        let row = parseInt(line[0])
        let col = parseInt(line[1])
        console.assert(1 <= row <= board_size)
        console.assert(1 <= col <= board_size)
    	if (dir === "l") {
    		barriers_right.push([row, col-1])
    	}
    	else if (dir === "r") {
    		barriers_right.push([row, col])
    	}
    	else if (dir === "u") {
    		barriers_down.push([row-1, col])
    	}
    	else if (dir === "d") {
    		barriers_down.push([row, col])
    	}
    }
    

    return new Board(board_size, init_positions, goal_position, barriers_right, barriers_down)
}