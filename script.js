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

  const getWinningSeq = () => winningSeq;

  function resetGame() {
    board = new Array(9).fill(null);
  }

  function hasPlayerWon(player) {
    for (const seq of winningSeqs) {
      if (seq.every(val => board[val] === player)) {
        winningSeq = seq;
        console.log(`${player.name} won`);

        return true;
      }
    }
  }

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

  return {markCell, resetGame, hasPlayerWon, isGameTie, getWinningSeq};
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
    let roundStatus = "";

    if (isNaN(cell)) return null;
    if (!Gameboard.markCell(activePlayer, cell)) return null;

    if (Gameboard.hasPlayerWon(activePlayer)) roundStatus = "win";
    else if (Gameboard.isGameTie()) roundStatus = "tie";

    if (roundStatus) Gameboard.resetGame();
    else togglePlayer();

    return roundStatus;
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

  Game.player1.name = "Player_X";
  Game.player1.icon = "✖";
  Game.player1.color = "#fe6666";
  Game.player2.name = "Player_O";
  Game.player2.icon = "🞅";
  Game.player2.color = "#62b5fe";

  gameboard.addEventListener("click", (e) => {
    const clickedCell = e.target.closest(".cell");
    if (!clickedCell) return;

    let activePlayer = Game.getActivePlayer();
    
    const cellNum = Array.from(cells).indexOf(clickedCell);
    const roundStatus = Game.playRound(cellNum);

    if (roundStatus !== null) {
      clickedCell.children[0].textContent = activePlayer.icon;
      clickedCell.children[0].style.color = activePlayer.color;
    }

    if (roundStatus) {
      alertModal.classList.add("open");
      gameboard.classList.add("disable");
    }

    if (roundStatus === "win") {
      alertSpan.textContent = `${activePlayer.name} won`;
      alertModal.classList.add("win");
      // recolor winning cells
      Gameboard.getWinningSeq().forEach(
        cell => Array.from(cells)[cell].classList.add("winning")
      );
    } else if (roundStatus === "tie") {
      alertSpan.textContent = "Game ended in a tie";
      alertModal.classList.add("tie");
    }

  })

  alertBtn.addEventListener("click", (e) => {
    cellSpans.forEach(span => span.textContent = "");
    alertModal.classList.remove("open", "win", "tie");
    gameboard.classList.remove("disable");
    Array.from(cells).forEach(cell => cell.classList.remove("winning"))
  })
}

DisplayControl();