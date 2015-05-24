function Cell () {
  this.alive = Math.random() > 0.6;
  this.neighbors = 0;
}

function Conway (size) {
  this.size = size;
  this.grid = this.generateGrid(size);
  this.directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
}

Conway.prototype.generateGrid = function (size) {
    var grid = [];
    for (var i = 0; i < size; i++) {
      var row = [];
      for (var j = 0; j < size; j ++) {
        row.push(new Cell());
      }
      grid.push(row);
    }
    return grid;
};

Conway.prototype.show = function () {
  process.stdin.write("\033[2j");
  for (var i = 0; i < this.size; i ++) {
    var row = this.grid[i];
    var rowString = "";
    for (var j = 0; j < this.size; j++) {
      var cell = row[j];
      if (cell.alive) {
        rowString += "X";
      } else {
        rowString += " ";
      }
    }
    console.log(rowString);
  }
};

Conway.prototype.isUnderpopulated = function (r,c) {
  var cell = this.grid[r][c];
  return cell.neighbors < 2
};

Conway.prototype.isOverpopulated = function (r,c) {
  var cell = this.grid[r][c];
  return cell.neighbors > 3
};

Conway.prototype.isResurrectable = function (r,c) {
  var cell = this.grid[r][c];
  return !cell.alive && cell.neighbors === 3
};

Conway.prototype.inInBounds = function (r,c) {
  return r >= 0 && r < this.size && c >= 0 && c < this.size;
};

Conway.prototype.updateNeighborsForCell = function (r,c) {
  var cell = this.grid[r][c];
  cell.neighbors = 0;
  for (var i = 0; i < this.directions.length; i++) {
    var direction = this.directions[i];
    var dr = direction[0];
    var dc = direction[1];
    if (this.inInBounds(r + dr, c + dc)) {
      var neighbor = this.grid[r + dr][c + dc];
      if (neighbor.alive) {
        cell.neighbors += 1;
      }
    }
  }
};

Conway.prototype.updateNeighbors = function () {
  for (var i = 0; i < this.size; i++) {
    for (var j = 0; j < this.size; j ++) {
      this.updateNeighborsForCell(i,j);
    }
  }
};

Conway.prototype.updateStateForCell = function (r,c) {
  var cell = this.grid[r][c];
  if (this.isUnderpopulated(r,c) || this.isOverpopulated(r,c)) {
    cell.alive = false;
  } else if (this.isResurrectable(r,c)) {
    cell.alive = true;
  }
};

Conway.prototype.updateStates = function () {
  for (var i = 0; i < this.size; i++) {
      for (var j = 0; j < this.size; j ++) {
        this.updateStateForCell(i,j);
      }
    }
};

var conway = new Conway(120);

var interval = setInterval(function() {
  conway.show();
  conway.updateNeighbors();
  conway.updateStates();
}, 30)