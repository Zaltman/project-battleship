function shipFactory(length) {
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

module.exports = shipFactory;
// let ship1 = createShip(4);
// ship1.hit(0);
// ship1.hit(1);
// ship1.hit(2);
// ship1.hit(3);
// console.log(ship1.isSunk());

// console.log(ship1);
