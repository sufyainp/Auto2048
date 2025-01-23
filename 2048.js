var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
    document.getElementById('automateButton').addEventListener('click', automateGame);
}

function setGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();

}

//This is used to add color to the tiles based on value
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}




function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}


function isGameOver() {
    if (hasEmptyTile()) {
        return false; // Game is not over if there's an empty tile
    }

    // Check for possible merges horizontally and vertically
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (r > 0 && board[r][c] == board[r - 1][c]) {
                return false; // Can merge with the tile above
            }
            if (r < rows - 1 && board[r][c] == board[r + 1][c]) {
                return false; // Can merge with the tile below
            }
            if (c > 0 && board[r][c] == board[r][c - 1]) {
                return false; // Can merge with the tile to the left
            }
            if (c < columns - 1 && board[r][c] == board[r][c + 1]) {
                return false; // Can merge with the tile to the right
            }
        }
    }
    return true; // No moves available, game over
}

function checkGameOver() {
    if (isGameOver()) {
        
        document.removeEventListener('keyup', handleKeyPress); // Stop listening for key presses
        let restart = confirm("Game Over! Final Score: " + score + ". Do you want to restart?");
        if (restart) {
            location.reload(); // Restart the game
        };
    }
}

function handleKeyPress(e) {
    let moved = false;

    if (e.code == "ArrowLeft") {
        moved = true;
        slideLeft();
        setTwo();
    } else if (e.code == "ArrowRight") {
        moved = true; slideRight();setTwo();
    } else if (e.code == "ArrowUp") {
        moved = true;slideUp();setTwo();
    } else if (e.code == "ArrowDown") {
        moved = true;slideDown();setTwo();
    }
    document.getElementById("score").innerText = score;

    if (moved) { 
        checkGameOver(); // Check if the game is over after a move
    }
}

document.addEventListener('keyup', handleKeyPress);


function automateGame() {
    if (!isGameOver()) {
        makeBestMove();
        setTimeout(automateGame, 100); // Automate until the game is over (adjust timing as needed)
    } else {
        alert("Game Over! Final Score: " + score);
    }
}

// Simulate the best move for automation
function makeBestMove() {
    const bestMove = getBestMove();
    handleKeyPress({ code: bestMove }); // Trigger the best move
}

function evaluateBoard(board) {
    // Simple evaluation: sum of all tile values
    let score = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            score += board[r][c];
        }
    }
    return score;
}

function copyBoard(originalBoard) {
    return originalBoard.map(row => row.slice()); // Create a shallow copy of the board
}
function simulateMove(move) {
    let simulatedBoard = copyBoard(board); // Create a copy of the current board
    switch (move) {
        case 'ArrowLeft':
            slideLeft(simulatedBoard);
            break;
        case 'ArrowRight':
            slideRight(simulatedBoard);
            break;
        case 'ArrowUp':
            slideUp(simulatedBoard);
            break;
        case 'ArrowDown':
            slideDown(simulatedBoard);
            break;
    }
    return simulatedBoard;
}
function getBestMove() {
    let bestMove = null;
    let bestScore = -Infinity;
    
    // Simulate all possible moves and calculate the score
    ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach(move => {
        let simulatedBoard = simulateMove(move); // Function to simulate move without changing the original board
        let moveScore = evaluateBoard(simulatedBoard); // Function to evaluate the board's score
        if (moveScore > bestScore) {
            bestScore = moveScore;
            bestMove = move;
        }
    });
    
    return bestMove;
}


function toggleDarkMode() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');

    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        modeToggle.classList.add('dark');
    } else {
        modeToggle.classList.remove('dark');
    }
}
