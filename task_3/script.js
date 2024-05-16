document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset');
    const modeInputs = document.querySelectorAll('input[name="mode"]');

    let currentPlayer = 'X';
    let gameStatus = ['','','','','','','','',''];
    let gameMode = 'pvp'; // Default mode: Player vs Player

    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    // Function to check if there's a winner
    const checkWinner = () => {
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameStatus[a] && gameStatus[a] === gameStatus[b] && gameStatus[a] === gameStatus[c]) {
                return gameStatus[a];
            }
        }
        return null;
    };

    // Function to check if the board is full (tie)
    const isBoardFull = () => {
        return !gameStatus.includes('');
    };

    // Function to handle cell click
    const handleCellClick = (index) => {
        if (gameStatus[index] || checkWinner()) return;

        gameStatus[index] = currentPlayer;
        renderBoard();

        const winner = checkWinner();
        if (winner) {
            status.textContent = `Player ${winner} wins!`;
        } else if (isBoardFull()) {
            status.textContent = "It's a tie!";
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;
        }

        if (gameMode === 'pva' && currentPlayer === 'O' && !winner) {
            setTimeout(() => aiMove(), 500); // AI makes move after a delay
        }
    };

    // Function for AI move
    const aiMove = () => {
        let emptyCells = gameStatus.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);

        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        handleCellClick(emptyCells[randomIndex]);
    };

    // Function to reset the game
    const resetGame = () => {
        currentPlayer = 'X';
        gameStatus = ['','','','','','','','',''];
        renderBoard();
        status.textContent = `Player ${currentPlayer}'s turn`;
    };

    // Function to render the board
    const renderBoard = () => {
        board.innerHTML = '';
        gameStatus.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => {
                if (gameMode === 'pvp' || (gameMode === 'pva' && currentPlayer === 'X')) {
                    handleCellClick(index);
                }
            });
            board.appendChild(cellElement);
        });
    };

    // Event listener for reset button
    resetButton.addEventListener('click', resetGame);

    // Event listener for mode selection
    modeInputs.forEach(input => {
        input.addEventListener('change', () => {
            gameMode = input.value;
            resetGame();
            if (gameMode === 'pva' && currentPlayer === 'O') {
                aiMove(); // AI makes the first move if in AI mode
            }
        });
    });

    // Initial render
    renderBoard();
});
