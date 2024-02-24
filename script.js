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

  function allCellsFilled() {
    return board.every(val => val != null);
  }

  function markCell(player, cell) {
    if (board[cell]) {
      console.log("cell is occupied");
      return;
    }

    board[cell] = player;

    return true;
  }

  return {markCell, resetGame, hasPlayerWon, allCellsFilled, getWinningSeq};
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
    else if (Gameboard.allCellsFilled()) roundStatus = "tie";

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
  const startBtn = document.getElementById("start");
  const player1NameField = document.getElementById("player1-name");
  const player2NameField = document.getElementById("player2-name");
  const player1NameBox = document.getElementById("player1-name-box");
  const player2NameBox = document.getElementById("player2-name-box");

  Game.player1.icon = "✖";
  Game.player1.color = "#fe6666";
  Game.player2.icon = "🞅";
  Game.player2.color = "#62b5fe";

  startBtn.addEventListener("click", (e) => {
    if (!player1NameField.value || !player2NameField.value) {
      console.log("fill out player names to start the game");
      return
    };
    if (player1NameField.value === player2NameField.value) {
      console.log("can't use same name for players");
      return
    };

    Game.player1.name = player1NameField.value;
    Game.player2.name = player2NameField.value;

    player1NameBox.classList.add("active");
    
    gameboard.classList.remove("disable");
    gameboard.style.opacity = 1;
  })

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
    } else {
      player1NameBox.classList.toggle("active");
      player2NameBox.classList.toggle("active");
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
    player1NameBox.classList.remove("active");
    player2NameBox.classList.remove("active");
    Array.from(cells).forEach(cell => cell.classList.remove("winning"))
  })
}

DisplayControl();