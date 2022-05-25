const shipFactory = (length) => {
  let shipSquares = [];
  for (let i = 0; i < length; i++) {
    shipSquares[i] = false;
  }
  const hitProto = {
    hit: function hit(hitSquareIndex) {
      let targetSquare = hitSquareIndex;
      this.shipSquares[targetSquare] = true;
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

export { shipFactory };
