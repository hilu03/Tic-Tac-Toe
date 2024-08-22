function Gameboard() {
  const row = 3;
  const column = 3;
  const board = [];
  let moveCount = 0;

  for (let i=0; i<row; i++) {
    board[i] = [];
    for (let j=0; j<column; j++) {
      board[i].push("");
    }
  }

  const checkAvailableCell = (rowIndex, columnIndex) => board[rowIndex][columnIndex] === ""; 

  const getBoard = () => board;

  const getCell = (rowIndex, columnIndex) => board[rowIndex][columnIndex];

  const getMoveCount = () => moveCount;

  const drawMark = (rowIndex, columnIndex, mark) => {
    if (checkAvailableCell(rowIndex, columnIndex)) {
      board[rowIndex][columnIndex] = mark;
      moveCount++;
    }
  }

  return { getBoard, drawMark, getCell, getMoveCount };
}

function GameController(xPlayer = "X", oPlayer = "O") {
  const board = Gameboard();
  let result = -1;

  const players = [
    {
      name: xPlayer,
      mark: "X"
    },
    {
      name: oPlayer,
      mark: "O"
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0]? players[1]: players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    console.log(board.getBoard());
    console.log(`${activePlayer.name}'s turn.`);
  }

  printNewRound();

  const playRound = (rowIndex, columnIndex) => {
    board.drawMark(rowIndex, columnIndex, activePlayer.mark);
    if (checkWinner(rowIndex, columnIndex, activePlayer.mark)) {
      console.log(board.getBoard());
      console.log(`${activePlayer.name} wins!`);
      result = 1;
      return;
    }
    else if (board.getMoveCount() === 9) {
      console.log(board.getBoard());
      console.log("It's a tie!");
      result = 0;
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
    
    if (rowIndex + columnIndex === 2) {
      //anti-diag
      for (let i = 0; i < 4; i++) {
        if (i === 3) {
          return true;
        }
        if (board.getCell(i, 2 - i) !== mark) {
          break;
        }
      }
    }
    return false;
  };

  const getResult = () => result;

  return { playRound, getActivePlayer, getResult };
}

function DisplayController() {
  let game;
  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", () => {
    const xPlayer = document.querySelector("#x").value || "X";
    const oPlayer = document.querySelector("#o").value || "O";
    game = GameController(xPlayer, oPlayer);
    startButton.textContent = "new game";
    clearResult();
    renderGameboard();
  });

  const renderGameboard = () => {
    const board = document.querySelector(".board");
    let html = "";
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        html += `<div class='cell' data-row='${i}' data-column='${j}'></div>`;
      }
    }
    board.innerHTML = html;
    displayPlayerTurn();

    const gridCells = document.querySelectorAll(".cell");
    gridCells.forEach(cell => {
      cell.addEventListener("click", () => {
        if (cell.textContent.length === 0 && game.getResult() === -1) {
          cell.textContent = game.getActivePlayer().mark;
          cell.classList.add(game.getActivePlayer().mark);
          game.playRound(Number(cell.dataset.row), Number(cell.dataset.column));
          if (game.getResult() !== -1) {
            displayResult();
          }
          else {
            displayPlayerTurn(); 
          } 
        }
      });
    });  
  };

  const displayPlayerTurn = () => {
    const turn = document.querySelector(".turn");
    turn.innerHTML = `<span class="${game.getActivePlayer().mark}">${game.getActivePlayer().name}</span> 's turn.`;
  }

  const displayResult = () => {
    const result = document.querySelector(".result");
    if (game.getResult() === 0) {
      result.innerHTML = "It 's a tie!";
    }
    else {
      result.innerHTML = `We got the winner. <span class="${game.getActivePlayer().mark}">${game.getActivePlayer().name}</span> wins!`;
    }
  };

  const clearResult = () => {
    const result = document.querySelector(".result");
    result.textContent = "";
  }
}

const display = DisplayController();