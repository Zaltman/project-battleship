function domFactory() {
  let body = document.querySelector('body');
  let gameStateContainer = document.createElement('div');
  function addGameStateContainer() {
    gameStateContainer.textContent = 'Game state placeholder';
    gameStateContainer.setAttribute('id', 'gameState');
    body.appendChild(gameStateContainer);
  }
  function changeGameStateStr(str) {
    gameStateContainer.textContent = str;
  }
  function renderShips(playerArray, whichBoard) {
    if (whichBoard == 1) {
      let squareContainer = document.querySelector('#p1Container');
      colorizeShips(squareContainer);
    } else if (whichBoard == 2) {
      let squareContainer = document.querySelector('#p2Container');
      colorizeShips(squareContainer);
    } else alert('provide whichBoard to domController.renderShips function');

    function colorizeShips(squareContainer) {
      for (let i = 0; i < playerArray.length; i++) {
        let domSquare = squareContainer.querySelector(`[squareIndex="${i}"]`);
        if (playerArray[i] && playerArray[i] !== 'missed shot') {
          domSquare.classList.add('shipSquare');
        }
        if (
          playerArray[i] &&
          playerArray[i].ship &&
          playerArray[i].ship.shipSquares[playerArray[i].shipSquareHitIndex] ==
            true
        ) {
          domSquare.classList.add('shotSquare');
        } else if (playerArray[i] == 'missed shot') {
          domSquare.classList.add('missedShot');
        }
      }
    }
  }
  function dragableShipsStack() {
    let squares = document.querySelectorAll('.boardSquare.player1');
    let shipsContainer = document.createElement('div');

    shipsContainer.classList.add('shipsContainer');
    shipsContainer.textContent = 'test';
    function addDragableShip() {
      let ship = document.createElement('div');
      ship.classList.add('draggableShip');
      ship.setAttribute('draggable', 'true');
      ship.addEventListener('dragstart', handleDragStart);
      ship.addEventListener('dragend', handleDragEnd);

      shipsContainer.appendChild(ship);
    }
    function handleDragStart(e) {
      this.style.opacity = '0.4';
      console.log(e.target);
    }
    function handleDragEnd(e) {
      this.style.opacity = '1';
      console.log(e.target);

      squares.forEach(function (item) {
        item.classList.remove('over');
      });
    }
    function handleDragOver(e) {
      e.preventDefault();
      return false;
    }

    function handleDragEnter(e) {
      this.classList.add('over');
    }

    function handleDragLeave(e) {
      this.classList.remove('over');
    }

    squares.forEach(function (item) {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('dragenter', handleDragEnter);
      item.addEventListener('dragleave', handleDragLeave);
      item.addEventListener('dragend', handleDragEnd);
      // item.addEventListener('drop', handleDrop);
    });

    document.querySelector('#boardContainer').prepend(shipsContainer);
    addDragableShip();
  }
  return {
    addGameStateContainer,
    renderShips,
    changeGameStateStr,
    dragableShipsStack,
  };
}

export { domFactory };

// placingAttempt(1, playerArray);
// placingAttempt(1, playerArray);
// placingAttempt(2, playerArray);
// placingAttempt(2, playerArray);
// placingAttempt(3, playerArray);
// placingAttempt(3, playerArray);
// placingAttempt(4, playerArray);
// placingAttempt(5, playerArray);
