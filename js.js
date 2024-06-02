document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.querySelector('#status');
    const restartButton = document.querySelector('#restart');
    const playVsComputerButton = document.querySelector('#play-vs-computer');
    const playVsFriendButton = document.querySelector('#play-vs-friend');
    const winSound = document.querySelector('#win-sound');
    const clickSound = document.querySelector('#click-sound');
    const drawSound = document.querySelector('#draw-sound');
    

    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let isGameActive = true;
    let playVsComputer = false;

    const confettiSettings = { target: 'confetti-canvas' };
    const confetti = new ConfettiGenerator(confettiSettings);

    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !isGameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = `<span class="${currentPlayer}">${currentPlayer}</span>`;
        clickSound.play();
        handleResultValidation();

        if (playVsComputer && currentPlayer === 'O' && isGameActive) {
            makeComputerMove();
        }
    };

    const handleResultValidation = () => {
        let roundWon = false;
        let winningCells = [];
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = gameState[winCondition[0]];
            const b = gameState[winCondition[1]];
            const c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningCells = winCondition;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.textContent = `Player ${currentPlayer} wins!`;
            winningCells.forEach(index => cells[index].classList.add('win'));
            winSound.play();
            confetti.render();
            isGameActive = false;
            return;
        }

        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.textContent = 'Draw!';
            drawSound.play();
            isGameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    };

    const makeComputerMove = () => {
        let bestMove = getBestMove();
        gameState[bestMove] = 'O';
        cells[bestMove].innerHTML = `<span class="O">O</span>`;
        clickSound.play();
        handleResultValidation();
    };

    const getBestMove = () => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                let score = minimax(gameState, 0, false);
                gameState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    };

    const minimax = (board, depth, isMaximizing) => {
        let scores = {
            'X': -1,
            'O': 1,
            'tie': 0
        };

        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const checkWinner = () => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return gameState[a];
            }
        }

        if (!gameState.includes('')) {
            return 'tie';
        }

        return null;
    };

    const restartGame = () => {
        clickSound.play();
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('win');
        });
        isGameActive = true;
        confetti.clear();
    };

    const toggleMode = (mode) => {
        playVsComputer = (mode === 'computer');
        playVsComputerButton.textContent = playVsComputer ? 'Playing vs Computer' : 'Play vs Computer';
        playVsFriendButton.textContent = playVsComputer ? 'Play vs Friend' : 'Playing vs Friend';
        restartGame();
    };

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    playVsComputerButton.addEventListener('click', () => toggleMode('computer'));
    playVsFriendButton.addEventListener('click', () => toggleMode('friend'));
});
const handleResultValidation = () => {
    let roundWon = false;
    let winningCells = [];
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCells = winCondition;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        winningCells.forEach(index => cells[index].classList.add('win'));
        if (currentPlayer === 'O' && playVsComputer) {
            // صوت لفوز الكمبيوتر
            computerWinSound.play();
        }  
        
        confetti.render();
        isGameActive = false;
        return;
    }

    let roundDraw = !gameState.includes('');
    if (roundDraw) {
        statusDisplay.textContent = 'Draw!';
        drawSound.play();
        isGameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
};
