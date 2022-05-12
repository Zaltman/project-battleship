import _ from 'lodash';
import './styles.css';

const shipFactory = (length) => {
  let shipSquares = [];
  for (let i = 0; i < length; i++) {
    shipSquares[i] = false;
  }
  const hitProto = {
    hit: function hit(hitSquareIndex) {
      this.shipSquares[hitSquareIndex] = true;
    },
  };
  const isSunkProto = {
    isSunk: function isSunk() {
      for (let i = 0; i < this.shipSquares.length; i++) {
        if (this.shipSquares[i] == false) return false;
      }
      return true;
    },
  };
  return Object.assign({}, isSunkProto, hitProto, { shipSquares });
};
let shipTest = shipFactory(3);
const squaresObj = {
  p1SquaresArray: Array(100),
  p2SquaresArray: Array(100),
};

function gameBoardFactory() {
  let mainContainer = document.createElement('div');
  mainContainer.setAttribute('id', 'mainContainer');
  document.querySelector('body').appendChild(mainContainer);
  let createBoard = function () {
    for (let i = 0; i < 2; i++) {
      let whichPlayer;
      let playerContainer = document.createElement('div');
      if (!document.querySelector('#p1Container')) {
        playerContainer.setAttribute('id', 'p1Container');
        whichPlayer = 'player1';
      } else {
        playerContainer.setAttribute('id', 'p2Container');
        whichPlayer = 'player2';
      }
      mainContainer.appendChild(playerContainer);
      (function cordinateColumnF() {
        let coordinateColumn = document.createElement('div');
        coordinateColumn.classList.add('coordinateColumn');
        playerContainer.appendChild(coordinateColumn);

        for (let i = 0; i < 10; i++) {
          let coordinateSquare = document.createElement('div');
          coordinateSquare.classList.add('coordinateSquareColumn');
          coordinateSquare.textContent = String.fromCharCode(i + 65);
          coordinateColumn.appendChild(coordinateSquare);
        }
      })();
      (function cordinateRowF() {
        let coordinateRow = document.createElement('div');
        coordinateRow.classList.add('coordinateRow');
        playerContainer.appendChild(coordinateRow);
        for (let i = 0; i < 10; i++) {
          let coordinateSquare = document.createElement('div');
          coordinateSquare.classList.add('coordinateSquareRow');
          coordinateSquare.textContent = i + 1;
          coordinateRow.appendChild(coordinateSquare);
        }
      })();
      let shipSquaresContainer = document.createElement('div');
      shipSquaresContainer.classList.add('squaresContainer');
      playerContainer.appendChild(shipSquaresContainer);

      (function fillWithSquares() {
        for (let i = 0; i < 100; i++) {
          let boardSquare = document.createElement('div');
          boardSquare.classList.add('boardSquare');
          boardSquare.classList.add(whichPlayer);
          boardSquare.setAttribute('squareId', i);
          shipSquaresContainer.appendChild(boardSquare);
        }
      })();
    }
  };
  // placingDirrection h for horizontal, v for vertical
  let placeShip = function (
    shipSize,
    placeWhichSquareIndex,
    placingDirection,
    playerArray
  ) {
    let ship = shipFactory(shipSize);
    function shipPlacing(i, playerArray) {
      playerArray[placeWhichSquareIndex + i] = {};
      playerArray[placeWhichSquareIndex + i].ship = ship;
      let x = i;
      if (x >= 10) {
        x /= 10;
      }

      playerArray[placeWhichSquareIndex + i].shipSquareHitIndex = x;
    }
    let ablePlaceShipCheck = function (
      shipSize,
      playerArray,
      placeWhichSquareIndex
    ) {
      let isSquareTaken = false;
      for (let i = 0; i < shipSize; i++) {
        console.log(playerArray[placeWhichSquareIndex + i]);
        if (playerArray[placeWhichSquareIndex + i]) {
          isSquareTaken = true;
        }
      }
      if (!isSquareTaken) return true;
      else return false;
    };
    function placingHorizontaly() {
      if (!ablePlaceShipCheck(shipSize, playerArray, placeWhichSquareIndex)) {
        return alert(
          'target area is taken by other ship, ablePlaceShipCheck function'
        );
      }
      //check if ship fits and place it
      if (
        String(10 + placeWhichSquareIndex).charAt(0) !==
        String(10 + placeWhichSquareIndex + shipSize - 1).charAt(0)
      ) {
        return alert('doesnt fit shipPlacing function');
      }
      for (let i = 0; i < shipSize; i++) {
        shipPlacing(i, playerArray);
      }
    }
    function placingVerticaly() {
      if (placeWhichSquareIndex + shipSize * 10 - 9 > 100) {
        return alert('doesnt fit shipPlacing function');
      }

      for (let i = 0; i < shipSize * 10; i += 10) {
        shipPlacing(i, playerArray);
      }
    }
    if (placingDirection == 'h') {
      placingHorizontaly();
    } else if (placingDirection == 'v') {
      placingVerticaly();
    } else alert('something wrong with placeShip function');
  };
  let receiveAttack = function (coord, playerArray) {
    if (playerArray[coord] && playerArray[coord] !== 'missed shot') {
      let hitIndex = playerArray[coord].shipSquareHitIndex;
      playerArray[coord].ship.hit(hitIndex);
    } else if (!playerArray[coord]) {
      playerArray[coord] = 'missed shot';
    } else alert('receiveAttack function, already shot or something else');
  };
  let checkIfAllSunk = function (playerArray) {
    for (let i = 0; i < playerArray.length; i++) {
      if (
        playerArray[i] &&
        playerArray[i] !== 'missed shot' &&
        playerArray[i].ship.isSunk() == false
      ) {
        return false;
      }
    }
    return true;
  };
  return { createBoard, placeShip, receiveAttack, checkIfAllSunk };
}

const playerFactory = (playerArray) => {
  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const rndInt = randomIntFromInterval(1, 6);
  let shipPopulate = function () {
    let shipCoords = randomIntFromInterval(0, 100);
  };
};
let gameBoard = gameBoardFactory();
gameBoard.createBoard();
gameBoard.placeShip(3, 0, 'h', squaresObj.p1SquaresArray);
gameBoard.placeShip(1, 3, 'h', squaresObj.p1SquaresArray);
// gameBoard.receiveAttack(0, squaresObj.p1SquaresArray);

// gameBoard.receiveAttack(1, squaresObj.p1SquaresArray);

// gameBoard.receiveAttack(2, squaresObj.p1SquaresArray);
// gameBoard.receiveAttack(5, squaresObj.p1SquaresArray);
// gameBoard.receiveAttack(19, squaresObj.p1SquaresArray);
// gameBoard.receiveAttack(19, squaresObj.p1SquaresArray);

console.log(squaresObj.p1SquaresArray);
// console.log(gameBoard.checkIfAllSunk(squaresObj.p1SquaresArray));
// console.log(gameBoard.checkIfAllSunk(squaresObj.p2SquaresArray));

// gameBoard.checkIfAllSunk(squaresObj.p1SquaresArray);
