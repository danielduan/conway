class Conway {
  constructor(config) {
    this.ms = 1000 / config.fps;
    this.rows = config.rows;
    this.columns = config.columns;
    this.seedPattern = config.seedPattern;

    this.grid = [];
    this.instantiateGrid();
    this.seedGrid();

    this.prevTime = performance.now();

    if (config.fps >= 60) {
      this.startRequestAnimationFrame();
    } else {
      this.startTimeout();
    }
  }

  instantiateGrid() {
    // I messed up here, rows == y direction | columns = x direction
    // so it's more like grid[y][x]
    for (let r = 0; r < this.rows; r++) {
      let column = [];
      for (let c = 0; c < this.columns; c++ ) {
        column.push(new Cell(this, c, r));
      }
      this.grid.push(column);
    }
  }

  seedGrid() {
    for (let i = 0; i < this.seedPattern.length; i++) {
      let coord = this.seedPattern[i];
      this.grid[coord[1]][coord[0]].set(true);
    }
  }

  getGridCellAlive(x, y) {
    // outside boundaries
    if (x < 0 || x >= this.columns || y < 0 || y >= this.rows) {
      return false;
    }
    return this.grid[y][x].get();
  }

  calcGrid(func) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.grid[r][c].calc();
      }
    }
  }

  stepGrid(func) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        this.grid[r][c].step();
      }
    }
  }

  startTimeout() {
    this.loop();

    setTimeout(() => {
      this.startTimeout();
    }, this.ms);
  }

  startRequestAnimationFrame() {
    this.loop();

    window.requestAnimationFrame(this.startRequestAnimationFrame.bind(this));
  }

  loop() {
    this.render();

    this.calcGrid();
    this.stepGrid();

    const time = performance.now()
    document.getElementById('fps').innerHTML = 1000 / (time - this.prevTime);
    this.prevTime = time;
  }

  toString() {
    // for console logs
    let output = '';

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        output += this.grid[r][c].toString();
      }
      output += '\n';
    }

    return output;
  }

  toHtml() {
    const re = new RegExp('\n', 'g');
    return this.toString().replace(re, '<br>');
  }

  render() {
    document.getElementById('game').innerHTML = this.toHtml();
  }
}

const game = new Conway({
  fps: 2,
  rows: 5,
  columns: 5,
  seedPattern: [[2,1],[2,2],[2,3]]
});
