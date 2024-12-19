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

    const win = () => {
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

    const winChecker = (playerSelections, winningCombo) => winningCombo.every(el => playerSelections.includes(el));

    const gameOver = (state) => {
        if (state) {
            `${getActivePlayer()} wins!`;
        }
    }

    const playRound = (row, column) => {
        // Active player takes a turn
        
        let turn = board.takeTurn(row, column, getActivePlayer().token);
        if (turn.isValid) {
            getActivePlayer().selections.push(`${row}[${column}]`);
            console.log(`FROM PLAYROUND ${getActivePlayer().token}'s selections: ${getActivePlayer().selections}`);
            // console.log(`winners: ${win()}`)
            // console.log(`gameOver true or false? ${gameOver}`)
            // Check for winner
            for (array of win()) {
                if (winChecker(getActivePlayer().selections, array)) {
                    console.log(`FROM PLAYROUND: ${getActivePlayer().name} wins!`)
                    // players[0].selections = [];
                    // players[1].selections = [];
                    gameOver(true);
                }
            }
            // switchPlayerTurn();
        }
        else {
            console.log("That square is taken!")
        }
    }

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        winChecker,
        win,
        switchPlayerTurn
    }
}

function ScreenController () {
    const game = GameController();
    const boardDiv = document.querySelector(".board");
    const turnDiv = document.querySelector(".turn");
    const winnerDiv = document.querySelector(".winner");

    const updateScreen = () => {
        // Clear board
        boardDiv.textContent = "";
        
        // Show updated board and get player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        turnDiv.textContent = `It's ${activePlayer.name}'s turn...`
        
        // console.log(`FROM updateScreen: ${game.getActivePlayer().token}'s selections: ${game.getActivePlayer().selections}`);
        // console.log(`FROM updateScreen: Winning combos: ${game.win()}`)
        // console.log(`FROM updateScreen: winChecker result: ${game.winChecker(game.getActivePlayer().selections, game.win())}`)
        // Render board
        for (i = 0; i < board.length; i++) {
            board[i].forEach((cell, index) => {
                // Create a button for each cell
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create row and column attributes to pass into playRound
                cellButton.dataset.row = i;
                cellButton.dataset.column = index;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        }
        console.log(`Here are ${activePlayer.name}'s selections: ${activePlayer.selections}`)
        console.log(`Here are the winning combos: ${game.win()}`)
        return {
            activePlayer
        }
        // for (array of game.win()) {
        //     if (game.winChecker(activePlayer.selections, array)) {
        //         console.log("winChecker works!!!")
        //     }
        //     else {
        //         console.log(`Still waiting`)
        //     }
        // }
        // console.log(game.winChecker(["0[0]", "0[1]", "0[2]"],[
        //     ["0[0]", "0[1]", "0[2]"], 
        //     ["1[0]", "1[1]", "1[2]"], 
        //     ["2[0]", "2[1]", "2[2]"],
        //     ["0[0]", "1[0]", "2[0]"],
        //     ["0[1]", "1[1]", "2[1]"],
        //     ["0[2]", "1[2]", "2[2]"],
        //     ["0[0]", "1[1]", "2[2]"],
        //     ["0[2]", "1[1]", "2[0]"]
        // ]))
        // console.log(`boardClickHandler ${game.winChecker(activePlayer.selections, game.win())}`)
        // console.log(`boardClickHandler ${game.winChecker(["0[0]", "0[1]", "0[2]"], game.win())}`)
        

    }
    // Event handler for buttons
    function boardClickHandler(e) {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        // const winner = game.getActivePlayer();
        // Ensure player has not clicked on space between row or column
        if (!selectedRow || !selectedColumn) return;
        // Input the row and column to the playRound function
        game.playRound(selectedRow, selectedColumn)
        for (array of game.win()) {
            if (game.winChecker(game.getActivePlayer().selections, array)) {
                console.log("winChecker works!!!")
                winnerDiv.textContent = `${game.getActivePlayer().name} wins!`
            }
            else {
                console.log(`Still waiting`)
            }
        }
        game.switchPlayerTurn();
        // Update the screen
        updateScreen();
    }

    boardDiv.addEventListener("click", boardClickHandler);
    updateScreen();

};

ScreenController();