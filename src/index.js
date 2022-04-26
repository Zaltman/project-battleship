import _ from 'lodash';
import './styles.css';

function createShip(length) {
  function createShip(length) {
    let shipSquares = [];
    for (let i = 0; i < length; i++) {
      shipSquares[i] = false;
    }
    return shipSquares;
  }

  return {
    shipSquares: createShip(length),
    hit: function (whichSquare) {
      this.shipSquares[whichSquare] = true;
    },
    isSunk: function () {
      for (let i = 0; i < this.shipSquares.length; i++) {
        if (this.shipSquares[i] == false) return 'ship is not sunk';
      }
      return 'ship has sunk';
    },
  };
}
let ship1 = createShip(4);

function gameBoardFactory() {
  function createP1Board() {
    for (let i = 0; i < 100; i++) {
      let boardSquare = document.createElement('div');
      boardSquare.classList.add('boardSquare');
      mainContainer.appendChild(boardSquare);
    }
  }
  createP1Board();
}

let mainContainer = document.createElement('div');
mainContainer.setAttribute('id', 'mainContainer');
document.querySelector('body').appendChild(mainContainer);
gameBoardFactory();
