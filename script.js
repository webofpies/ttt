"use strict";


const Gameboard = (function() {
  const board = new Array(9).fill(null);
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
    // players.forEach(player => player.playedCells = [])
  }

  function isGameOver(player) {
    for (const seq of winningSeqs) {
      if (seq.every(val => board[val] === player)) {
          console.log(`${player.name} won`);

          return true;
      } 
    }

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
    // player.playedCells.push(cell);
  }

  return {board, markCell, resetGame, isGameOver};
})();


const Game = (function() {
  const player1 = Player("Xavier", "✖");
  const player2 = Player("Oman", "🞅");

  const players = [player1, player2];
  let activePlayer = players[0];

  function togglePlayer() {
    activePlayer = players.reverse()[0];
    // console.log(activePlayer)
  }

  function playRound(cell) {
    if (isNaN(cell)) return;

    Gameboard.markCell(activePlayer, cell);
    if (Gameboard.isGameOver(activePlayer)) {
      Gameboard.resetGame();
    };
    
    togglePlayer();
    // console.log(Gameboard.board)
  }

  return {playRound};
  
})();


function Player(name, icon) {
  // const playedCells = [];

  return {
          name, 
          icon, 
          // playedCells,
        }
}


// function DisplayControl() {
//   const gameboard = document.getElementById("gameboard");
//   gameboard.addEventListener("click", (e) => {
//   const clickedCell = e.target.closest(".cell");
//   if (!clickedCell) return;

//   clickedCell.children[0].textContent = this.icon;
//   })
// }