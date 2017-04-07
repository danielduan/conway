class Cell {
  constructor(game, x, y, alive = false) {
    this.alive = alive;
    this.game = game;
    this.x = x;
    this.y = y;

    this.surrounding = [
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
      [x + 1, y],
      [x + 1, y - 1],
      [x, y - 1]
    ]
  }

  set(alive) {
    this.alive = alive;
  }

  get() {
    return this.alive;
  }

  calc() {
    const surroundingLives = this.surrounding.map((pos) => {
      return this.game.getGridCellAlive(...pos);
    }).reduce((sum, alive) => {
      return sum + (alive ? 1 : 0);
    });

    this.next = null;

    if (surroundingLives < 2) {
      this.next = false;
    } else if (surroundingLives >= 4) {
      this.next = false;
    } else if (this.alive) {
      this.next = true;
    } else if (surroundingLives === 3) {
      this.next = true;
    }
  }

  step() {
    this.alive = this.next;
    this.next = null;
  }

  toString() { // unicode for black and white squares, black == alive
    return this.alive ? '&#x25A0;' : '&#x25A1;';
  }
}
