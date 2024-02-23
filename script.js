"use strict";


const Gameboard = (function() {
  let board = new Array(9).fill(null);
  let winningSeq = [];
  const winningSeqs = [
                        [0, 3, 6],
                        [1, 4, 7],
                        [2, 5, 8],

                        [0, 1, 2],
                        [3, 4, 5],
                        [6, 7, 8],

                        [0, 4, 8],
                        [2, 4, 6]
                      ];

  function resetGame() {
    board = new Array(9).fill(null);
  }

  const getWinningSeq = () => winningSeq;

  function hasPlayerWon(player) {
    for (const seq of winningSeqs) {
      if (seq.every(val => board[val] === player)) {
        winningSeq = seq;
        console.log(`${player.name} won`);

        return true;
    }
  }
  }

  const getBoard = () => board;

  function isGameTie() {
    if (board.every(val => val != null)) {
      console.log("it's a tie");

      return true;
    }
  }

  function markCell(player, cell) {
    if (board[cell]) {
      console.log("cell is occupied");
      return;
    }

    board[cell] = player;

    return true;
  }

  return {markCell, resetGame, hasPlayerWon, isGameTie, getBoard, getWinningSeq};
})();


const Game = (function() {
  const player1 = new Player();
  const player2 = new Player();

  const players = [player1, player2];
  let activePlayer = players[0];

  function togglePlayer() {
    activePlayer = players.reverse()[0];
  }

  const getActivePlayer = () => activePlayer;

  function playRound(cell) {
    let gameStatus = "";

    if (isNaN(cell)) return null;
    if (!Gameboard.markCell(activePlayer, cell)) return null;

    if (Gameboard.hasPlayerWon(activePlayer)) gameStatus = "win";
    if (Gameboard.isGameTie()) gameStatus = "tie";

    if (gameStatus) Gameboard.resetGame();
    else togglePlayer();

    return gameStatus;
  }

  return {playRound, getActivePlayer, player1, player2};
  
})();


function Player(name, icon) {
  this.name = name;
  this.icon = icon;
}


function DisplayControl() {
  const gameboard = document.getElementById("gameboard");
  const cells = document.querySelectorAll(".cell");
  const alertModal = document.getElementById("alert");
  const alertBtn = document.getElementById("reset");
  const alertSpan = document.querySelector("#alert span");
  const cellSpans = document.querySelectorAll(".cell span");
  // console.log(cellSpans)

  Game.player1.name = "Xavier";
  Game.player1.icon = "✖";
  Game.player1.color = "#fe6666";
  Game.player2.name = "Oman";
  Game.player2.icon = "🞅";
  Game.player2.color = "#62b5fe";

  gameboard.addEventListener("click", (e) => {
    const clickedCell = e.target.closest(".cell");
    if (!clickedCell) return;

    let activePlayer = Game.getActivePlayer();
    
    const cellNum = Array.from(cells).indexOf(clickedCell);
    const gameStatus = Game.playRound(cellNum);

    if (gameStatus !== null) {
      clickedCell.children[0].textContent = activePlayer.icon;
      clickedCell.children[0].style.color = activePlayer.color;
    }

    if (gameStatus) {
      alertModal.classList.add("open");
      gameboard.classList.add("disable");
    }

    if (gameStatus === "win") {
      alertSpan.textContent = `${activePlayer.name} won`;
      alertModal.classList.add("win");

      Gameboard.getWinningSeq().forEach(
        cellNum => Array.from(cells)[cellNum].classList.add("winning")
      );

    } else if (gameStatus === "tie") {
      alertSpan.textContent = "Game ended in a tie";
      alertModal.classList.add("tie");
    }

    // console.log(Gameboard.getBoard())
  })

  alertBtn.addEventListener("click", (e) => {
    cellSpans.forEach(span => span.textContent = "");
    alertModal.classList.remove("open");
    gameboard.classList.remove("disable");
    Array.from(cells).forEach(cell => cell.classList.remove("winning"))
    // console.log(Gameboard.getBoard())
  })
}

DisplayControl();