"use strict";

const Gameboard = (function() {

  const gameArray = new Array(9).fill(null);
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
  
  function checkWin(player) {
    for (const seq of winningSeqs) {
      if (seq.every(val => player.playedCells.sort().includes(val))) {
          console.log(`${player.name} won`)

          return
      } 
    }

    if (gameArray.every(val => val != null)) {
      console.log("it's a tie")

      return
    }
  }

  function mark (player, cell) {
    if (gameArray[cell]) {
      console.log("cell is occupied")
      return
    }

    gameArray[cell] = [player, player.icon];
    player.playedCells.push(cell);

    checkWin(player);
  }


  // function addCellsEvent(player) {
  //   // const cells = document.querySelectorAll(".cell");
  //   const gameboard = document.getElementById("gameboard");
  //   gameboard.addEventListener("click", (e) => {
  //     const clickedCell = e.target.closest(".cell");
  //     if (!clickedCell) return;

  //     clickedCell.children[0].textContent = player.icon;
  //   })

  //   // cells.forEach(cell => {
  //   //   cell.addEventListener("click", (e) => {
  //   //     cell.children[0].textContent = player.icon;
  //   //   })
  //   // })
  // }

  return {mark};

})()

function Player(name, icon) {
  const playedCells = [];

  // const gameboard = document.getElementById("gameboard");
  // gameboard.addEventListener("click", (e) => {
  //   const clickedCell = e.target.closest(".cell");
  //   if (!clickedCell) return;

  //   clickedCell.children[0].textContent = this.icon;
  // })

  return {
          name, 
          icon, 
          playedCells,
          play(cell) {
            Gameboard.mark(this, cell);
          }
        }
}

const player1 = Player("Xavier", "✖");
const player2 = Player("Oman", "🞅");

// player1.play(3);
// player2.play(7);
// player1.play(4);
// player2.play(5);
// player1.play(6);
// player2.play(9);
// player1.play(2);

