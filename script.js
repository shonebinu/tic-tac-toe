const makeUser = function(name, marker) {
  const getName = () => name;
  const getMarker = () => marker;

  return {
    getName,
    getMarker,
  };
};

const gameBoard = (function() {
  const gameboard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const getBoard = () => gameboard;
  const setBoard = (x, y, marker) => gameboard[x][y] = marker;
  const resetBoard = () => gameboard.forEach(row => row.fill(""));

  return {
    getBoard,
    setBoard,
    resetBoard,
  };
})();

const domController = (function() {
  const cells = document.querySelectorAll(".board > div");
  const restartButton = document.querySelector(".restart");
  const playerDivs = document.querySelectorAll("[class^='player']");

  const updateCell = (index, marker) => {
    if (cells[index].textContent === "") {
      cells[index].textContent = marker;
    }
  };

  const resetCells = () => {
    cells.forEach(cell => cell.textContent = "");
  };

  const highlightWin = (winPattern) => {
    winPattern.forEach(index => {
      cells[index].classList.add("win-cell");
    });
  };

  const updatePlayerName = (player1, player2) => {
    playerDivs[0].firstChild.textContent = player1.getName();
    playerDivs[1].firstChild.textContent = player2.getName();
  };

  const bindCellListeners = (playTurn) => {
    cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        if (!gameController.isGameEnded()) {
          const x = Math.floor(index / 3);
          const y = index % 3;
          updateCell(index, gameController.getCurrentPlayer().getMarker());
          playTurn(x, y);
        }
      });
    });
  };

  const bindRestart = () => {
    restartButton.addEventListener("click", () => {
      resetCells();
      gameBoard.resetBoard();
      gameController.restartGame();
    });
  };

  const bindListeners = (playTurn) => {
    bindCellListeners(playTurn);
    bindRestart();

    customiseButton.addEventListener("click", () => {
      customiseDialog.showModal();
    });

    console.log("Listeners binded.");
  };

  return { bindListeners, highlightWin, updatePlayerName };
})();

const gameController = (function() {
  let currentPlayer = null;
  let gameEnded = false;

  const startGame = (player1, player2) => {
    currentPlayer = player1;
    domController.updatePlayerName(player1, player2);
    domController.bindListeners(playTurn);
    console.log(`${currentPlayer.getName()} starts the game.`);
  };

  const getCurrentPlayer = () => currentPlayer;

  const isGameEnded = () => gameEnded;

  const restartGame = () => gameEnded = false;

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = () => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const board = gameBoard.getBoard().flat();

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
        gameEnded = true;
        console.log(`${currentPlayer.getName()} wins!`);
        return [a, b, c];
      }
    }
  };

  const checkTie = () => {
    if (!gameBoard.getBoard().flat().includes("")) {
      gameEnded = true;
      console.log("It's a tie!");
      return true;
    }
  };

  const playTurn = (x, y) => {
    if (gameEnded) {
      console.log(`The game has already finished.`);
      return;
    }

    if (gameBoard.getBoard()[x][y] === "") {
      gameBoard.setBoard(x, y, currentPlayer.getMarker());

      winPattern = checkWin();
      if (winPattern) {
        domController.highlightWin(winPattern);
        console.log(`The winner of the game is ${currentPlayer.getName()}!`);
        return;
      } else if (checkTie() === true) {
        console.log("The game end in a tie!");
        return;
      }

      switchPlayer();
    } else {
      console.log("This cell has already been chosen. Please choose another one.");
    }
  };

  return {
    startGame,
    getCurrentPlayer,
    isGameEnded,
    restartGame,
    playTurn,
  };
})();

const player1 = makeUser("Player 1", "x");
const player2 = makeUser("Player 2", "o");

gameController.startGame(player1, player2);
