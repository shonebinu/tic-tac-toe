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

const gameController = (function() {
  let currentPlayer = null;
  let gameEnded = false;

  const startGame = (player1, player2) => {
    currentPlayer = player1;
    console.log(`${currentPlayer.getName()} starts the game.`);
  };

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
        console.log(a, b, c, board[a], board[b], board[c]);
        gameEnded = true;
        console.log(`${currentPlayer.getName()} wins!`);
        return true;
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

      if (checkWin() === true) {
        console.log(`The winner of the game is ${currentPlayer.getName()}!`);
      } else if (checkTie() === true) {
        console.log("The game end in a tie!");
      }

      switchPlayer();
    } else {
      console.log("This cell has already been chosen. Please choose another one.");
    }
  };

  return {
    startGame,
    playTurn,
  };
})();

const player1 = makeUser("Shone", "x");
const player2 = makeUser("Sera", "o");

gameController.startGame(player1, player2);
