"use strict";

function Player(name, score, icon) {
  this.name = name;
  this.icon = icon;
  this.score = score;
}

const Gameboard = (function () {
  let board = new Array(9).fill(null);
  const winningSeqs = [
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  const resetBoard = () => (board = new Array(9).fill(null));

  function getWinningSeq() {
    return winningSeqs.filter((seq) =>
      seq.every((val) => board[val] !== null && board[val] === board[seq[0]])
    );
  }

  function allCellsFilled() {
    return board.every((val) => val != null);
  }

  function markCell(player, cell) {
    if (board[cell]) return;

    board[cell] = player;

    return true;
  }

  return {
    resetBoard,
    markCell,
    getWinningSeq,
    allCellsFilled,
  };
})();

const Game = (function () {
  let gameWon;
  let roundStatus;
  let winScore = 3;
  const player1 = new Player();
  const player2 = new Player();
  const players = [player1, player2];
  player1.score = 0;
  player2.score = 0;

  let activePlayer = players[0];

  const togglePlayer = () => (activePlayer = players.reverse()[0]);
  const getActivePlayer = () => activePlayer;
  const isGameWon = () => gameWon;
  const getRoundStatus = () => roundStatus;
  const setWinScore = (score) => (winScore = score);

  function resetScores() {
    player1.score = 0;
    player2.score = 0;
  }

  function playRound(cell) {
    /*
    roundStatus => win: [winning sequence], tie: -1, continue: 0
    */
    roundStatus = 0;
    gameWon = false;

    if (isNaN(cell)) return;
    if (!Gameboard.markCell(activePlayer, cell)) return;

    if (Gameboard.getWinningSeq().length) {
      activePlayer.score++;
      roundStatus = Gameboard.getWinningSeq()[0];
      if (activePlayer.score === winScore) {
        gameWon = true;
      }
    } else if (Gameboard.allCellsFilled()) {
      roundStatus = -1;
    }

    if (roundStatus != 0) Gameboard.resetBoard();
    else togglePlayer(); // winning player is active at the end

    return true;
  }

  return {
    playRound,
    getActivePlayer,
    isGameWon,
    getRoundStatus,
    resetScores,
    setWinScore,
    player1,
    player2,
  };
})();

(function DisplayControl() {
  const gameboard = document.getElementById("gameboard");
  const cells = document.querySelectorAll(".cell");
  const alertModal = document.getElementById("alert");
  const resetBtn = document.getElementById("reset");
  const alertSpan = document.querySelector("#alert span");
  // const cellSpans = document.querySelectorAll(".cell span");
  const startBtn = document.getElementById("start");
  const player1NameField = document.getElementById("player1-name");
  const player2NameField = document.getElementById("player2-name");
  const player1NameBox = document.getElementById("player1-name-box");
  const player2NameBox = document.getElementById("player2-name-box");
  const player1ScoreEl = document.querySelector("#player1-score span");
  const player2ScoreEl = document.querySelector("#player2-score span");

  const cellsArray = Array.from(cells);

  Game.player1.className = "x";
  Game.player2.className = "o";

  Game.player1.scoreField = player1ScoreEl;
  Game.player1.nameField = player1NameField;
  Game.player2.scoreField = player2ScoreEl;
  Game.player2.nameField = player2NameField;

  startBtn.addEventListener("click", (e) => {
    if (!player1NameField.value || !player2NameField.value) {
      console.log("fill out player names to start the game");
      return;
    }
    if (player1NameField.value === player2NameField.value) {
      console.log("can't use same name for players");
      return;
    }

    Game.player1.name = player1NameField.value;
    Game.player2.name = player2NameField.value;

    player1NameField.setAttribute("disabled", "");
    player2NameField.setAttribute("disabled", "");

    player1NameBox.classList.add("active");

    gameboard.classList.remove("disable");
    gameboard.style.opacity = 1;
    startBtn.style.opacity = 0;
  });

  gameboard.addEventListener("mouseover", (e) => {
    const hoveredCell = e.target.closest(".cell");
    if (!hoveredCell) return;
    if (hoveredCell.classList.contains("occupied")) return;
    
    hoveredCell.classList.add(Game.getActivePlayer().className);
    // hoveredCell.children[0].textContent = Game.getActivePlayer().icon;
  }, true)

  gameboard.addEventListener("mouseout", (e) => {
    const hoveredCell = e.target.closest(".cell");
    if (!hoveredCell) return;
    if (hoveredCell.classList.contains("occupied")) return;
  
    hoveredCell.classList.remove("x", "o");;
  })

  gameboard.addEventListener("click", (e) => {
    const clickedCell = e.target.closest(".cell");
    if (!clickedCell) return;

    const activePlayer = Game.getActivePlayer();
    const cellNum = cellsArray.indexOf(clickedCell);
    if (!Game.playRound(cellNum)) return;

    clickedCell.classList.add(activePlayer.className, "occupied");

    const roundStatus = Game.getRoundStatus();
    if (roundStatus === 0) {
      player1NameBox.classList.toggle("active");
      player2NameBox.classList.toggle("active");
      return
    }

    let alertText;
    let alertClass;

    if (roundStatus === -1) {
      alertText = "Round ended in a tie";
      alertClass = "tie";
    } else {
      alertText = `${activePlayer.name} won the round`;
      alertClass = "win";
      // show score and highlight
      activePlayer.scoreField.textContent = activePlayer.score;
      activePlayer.scoreField.classList.add("highlight");
      // mark winning cells
      roundStatus.forEach((cell) => {
        cellsArray[cell].classList.add("winning");
      });

      if (Game.isGameWon()) {
        alertText = `${activePlayer.name} won the game`;
        alertClass = "gameover";
      }
    }
    // open alert window
    alertModal.classList.add(alertClass);
    gameboard.classList.add("disable");
    alertSpan.textContent = alertText;

    if (!Game.isGameWon()) {
      setTimeout(resetGameboardRound, "1000");
    }
  });

  resetBtn.addEventListener("click", function () {
    resetGameboardRound();
    Game.resetScores();
    player1NameBox.classList.remove("active");
    player2NameBox.classList.remove("active");
    player1ScoreEl.textContent = 0;
    player2ScoreEl.textContent = 0;
    player1NameField.removeAttribute("disabled");
    player2NameField.removeAttribute("disabled");
    gameboard.classList.add("disable");
    gameboard.style.opacity = 0;
    startBtn.style.opacity = 1;
  });

  function resetGameboardRound() {
    // close modal
    alertModal.classList.remove("win", "tie", "gameover");
    gameboard.classList.remove("disable");
    player1ScoreEl.classList.remove("highlight");
    player2ScoreEl.classList.remove("highlight");
    cellsArray.forEach((cell) => {
      cell.classList.remove("winning", "x", "o", "occupied");
    });
  }
})();