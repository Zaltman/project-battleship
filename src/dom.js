function domFactory() {
  let body = document.querySelector('body');
  function addGameStateContainer() {
    let gameStateContainer = document.createElement('div');
    gameStateContainer.textContent = 'Game state placeholder';
    gameStateContainer.setAttribute('id', 'gameState');
    body.appendChild(gameStateContainer);
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
  return { addGameStateContainer, renderShips };
}

export { domFactory };
