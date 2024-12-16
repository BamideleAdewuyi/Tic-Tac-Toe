// Set up Gameboard to represent state of the board
function Gameboard() {
    // 3 rows, 3 columns
    const rows = 3;
    const columns = 3;
    board = [];
    // First loop puts an empty array for each row
    // Second loop populates those arrays with 3 Cell functions
    // Result is 3 groups of 3 Cell functions representing cells on a grid
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    // This is how to render the board
    const getBoard = () => board;

    // Check to see if a square is taken. If not, move is valid and value can be changed to player number
    const takeTurn = (row, column, player) => {
        
        let isValid = true;
        // If the selected square is does not have a value of 0, it is taken so the move is invalid
        if (board[row][column].getValue() != 0) {
            isValid = false;
        };

        // Otherwise, the move is valid and square can have value changed to the player
        if (isValid) {
            board[row][column].addToken(player)
        };
        return {
            isValid
        }
    }

    // This method will be used to print our board to the console.
    // It is helpful to see what the board looks like after each turn as we play,
    // but we won't need it after we build our UI
    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    // Return these so it is possible to interact with the board
    return {getBoard, takeTurn, printBoard};
};

// Each cell is a square on grid, their default value is 0, for untaken.
// Their value can be changed to either 1 or 2, depending on which player has taken the square.
function Cell() {
    let value = 0;

    // Accept a player's token to change the value of the cell
    const addToken = (player) => {
        value = player;
    }

    // How we will retrieve the current value of this cell through closure
    const getValue = () => value;

    return {
        addToken,
        getValue
    };
};

// GameController is used to control flow and state of game. Also checks for winner
function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    
    const board = Gameboard();
    
    const players = [
        {
            name: playerOneName,
            token: 1,
            selections: []
        },
        {
            name: playerTwoName,
            token: 2,
            selections: []
        }
    ];

    // Default is player 1 goes first
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        // If active player is player 1, it will switch to player 2.
        // If active player is player 2, it will switch to player 1.
        activePlayer = activePlayer === players[0] ? players[1]:players[0];
    }

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const gameOver = () => {
        var winners = [
        ["0[0]", "0[1]", "0[2]"], 
        ["1[0]", "1[1]", "1[2]"], 
        ["2[0]", "2[1]", "2[2]"],
        ["0[0]", "1[0]", "2[0]"],
        ["0[1]", "1[1]", "2[1]"],
        ["0[2]", "1[2]", "2[2]"],
        ["0[0]", "1[1]", "2[2]"],
        ["0[2]", "1[1]", "2[0]"]
    ]

        return winners;
    }

    const playRound = (row, column) => {
        // Active player takes a turn
        let turn = board.takeTurn(row, column, getActivePlayer().token);
        if (turn.isValid) {
            // console.log("YESSS")
            getActivePlayer().selections.push(`${row}[${column}]`);
            console.log(`${getActivePlayer().token}'s selections: ${getActivePlayer().selections}`);
            console.log(`winners: ${gameOver()}`)
            // Switch player turn
            switchPlayerTurn();
        }
        else {
            console.log("That square is taken!")
        }
        // Check for winner

        printNewRound();
    }

    // Initial play game message
    printNewRound();

    return {
        playRound,
        getActivePlayer
    }
}

const game = GameController();