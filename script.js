function Gameboard() {
  const row = 3;
  const column = 3;
  const board = [];

  for (let i=0; i<row; i++) {
    board[i] = [];
    for (let j=0; j<column; j++) {
      board[i].push("");
    }
  }

  const checkAvailableCell = (rowIndex, columnIndex) => board[rowIndex][columnIndex] === ""; 

  const getBoard = () => board;

  const getCell = (rowIndex, columnIndex) => board[rowIndex][columnIndex];

  const drawMark = (rowIndex, columnIndex, mark) => {
    if (checkAvailableCell(rowIndex, columnIndex)) {
      board[rowIndex][columnIndex] = mark;
    }
  }

  return { getBoard, drawMark, getCell };
}

function GameController(player1 = "X", player2 = "O") {
  const board = Gameboard();
  let moveCount = 0;

  const players = [
    {
      name: player1,
      mark: "X"
    },
    {
      name: player2,
      mark: "O"
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0]? players[1]: players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    moveCount++;
    console.log(board.getBoard());
    console.log(`${activePlayer.name}'s turn.`);
  }

  printNewRound();

  const playRound = (rowIndex, columnIndex) => {
    board.drawMark(rowIndex, columnIndex, activePlayer.mark);
    if (checkWinner(rowIndex, columnIndex, activePlayer.mark)) {
      console.log(board.getBoard());
      console.log(`${activePlayer.name} wins!`);
      return;
    }
    else if (moveCount === 9) {
      console.log(board.getBoard());
      console.log("It's a tie!");
      return;
    }
    switchPlayerTurn();
    printNewRound();
  };

  const checkWinner = (rowIndex, columnIndex, mark) => {

    // column
    for (let i = 0; i < 4; i++) {
      if (i === 3) {
        return true;
      }
      if (board.getCell(i, columnIndex) !== mark) {
        break;
      }
    }

    // row
    for (let i = 0; i < 4; i++) {
      if (i === 3) {
        return true;
      }
      if (board.getCell(rowIndex, i) !== mark) {
        break;
      }
    }

    if (rowIndex === columnIndex) {
      //diag
      for (let i = 0; i < 4; i++) {
        if (i === 3) {
          return true;
        }
        if (board.getCell(i, i) !== mark) {
          break;
        }
      }
    }
    
    if (rowIndex + columnIndex === 4) {
      //anti-diag
      for (let i = 0; i < 4; i++) {
        if (i === 3) {
          return true;
        }
        if (board.getCell(i, 4 - i) !== mark) {
          break;
        }
      }
    }
    return false;
  };

  return { playRound };
}

const game = GameController();