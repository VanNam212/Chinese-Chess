class Piece {
  constructor(name, position, backgroundUrl) {
    this.name = name;
    this.backgroundUrl = backgroundUrl;
    this.position = position;
  }

  moveTo(newPos) {
    this.position = newPos;
  }

  // return a copy of a piece
  copy() {
    return new Piece(this.name, this.position, this.backgroundUrl);
  }
}

class Movement {
  constructor(fromRow, fromCol, destRow, destCol, isSoliderMovement) {
    this.fromRow = fromRow;
    this.fromCol = fromCol;
    this.destRow = destRow;
    this.destCol = destCol;
    this.isSoliderMovement = isSoliderMovement;
  }

  getFromRow() {
    return this.fromRow;
  }

  getFromCol() {
    return this.fromCol;
  }
  getDestRow() {
    return this.destRow;
  }
  getDestCol() {
    return this.destCol;
  }
  setFrom(fromRow, fromCol) {
    this.fromRow = fromRow;
    this.fromCol = fromCol;
  }
  setDest(destRow, destCol) {
    this.destRow = destRow;
    this.destCol = destCol;
  }
  isSoliderMovement() {
    return this.isSoliderMovement;
  }
  setSoliderMovement(soliderMovement) {
    this.isSoliderMovement = soliderMovement;
  }
}

const initPieceRed = [
  new Piece("90.01", [1, 1]),
  new Piece("90.01", [1, 9]),
  new Piece("50.01", [3, 2]),
  new Piece("50.01", [3, 8]),
  new Piece("40.01", [1, 2]),
  new Piece("40.01", [1, 8]),
  new Piece("25.01", [1, 3]),
  new Piece("25.01", [1, 7]),
  new Piece("20.01", [1, 4]),
  new Piece("20.01", [1, 6]),
  new Piece("10.01", [4, 1]),
  new Piece("10.01", [4, 3]),
  new Piece("10.01", [4, 5]),
  new Piece("10.01", [4, 7]),
  new Piece("10.01", [4, 9]),
  new Piece("999999999.01", [1, 5]),
];
const ext = ".png";
const rootPath = "./img/";
const spaceX = 57;
const spaceY = 57;
const initPieceBlack = [
  new Piece("90.00", [10, 1]),
  new Piece("90.00", [10, 9]),
  new Piece("50.00", [8, 2]),
  new Piece("50.00", [8, 8]),
  new Piece("40.00", [10, 2]),
  new Piece("40.00", [10, 8]),
  new Piece("25.00", [10, 3]),
  new Piece("25.00", [10, 7]),
  new Piece("20.00", [10, 4]),
  new Piece("20.00", [10, 6]),
  new Piece("10.00", [7, 1]),
  new Piece("10.00", [7, 3]),
  new Piece("10.00", [7, 5]),
  new Piece("10.00", [7, 7]),
  new Piece("10.00", [7, 9]),
  new Piece("999999999.00", [10, 5]),
];

var canvas = document.getElementById("myCanvas");


$(document).ready(function () {
  init(initPieceRed, 1);
  init(initPieceBlack, -1);
});

function init(listPiece = [], type) {
  var content = document.getElementById("content");
  var style = document.createElement("style");
  var styleCss = "";
  listPiece.map((item, index) => {
    item.backgroundUrl = rootPath + item.name + ext;
  });
  listPiece.map((item, index) => {
    var element = document.createElement("button");
    styleCss +=
      "#btn-" +
      index +
      type +
      " { background-image: url('" +
      item.backgroundUrl +
      "'); } ";
    element.setAttribute("class", "piece");
    element.setAttribute("onclick", "btn_Click(event, this.id)");
    element.setAttribute("id", "btn-" + index + type);
    var x = (item.position[0] - 1) * spaceX;
    var y = (item.position[1] - 1) * spaceY;
    element.style.top = "" + x + "px";
    element.style.left = "" + (y + 10) + "px";
    content.appendChild(element);
  });
  style.innerHTML = styleCss;
  document.head.appendChild(style);
}

function btn_Click(event, id) {
  var myButton = document.getElementById(String(id));
  myButton.style.opacity = 0.8;
  canvas.onclick = function (ev) {
    myButton.style.opacity = 1;
    var y = ev.clientX - canvas.offsetTop;
    var x = ev.clientY - canvas.offsetLeft;
    myButton.style.top = "" + (x - 16) + "px";
    // myButton.style.left = "" + (y - 140) + "px";
  }
  document.onmousedown = function (event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    // const y = event.clientY - rect.top;
    myButton.style.top = "" + x + "px";
    myButton.style.left = "" + y + "px";
    myButton.style.opacity = 1;
  };
}

//init chess
const BOARD_HEIGHT = 10;
const BOARD_WIDTH = 9;
var EMPTY = 0;
var finalMovement = new Movement();
var chess = [BOARD_HEIGHT][BOARD_WIDTH];
var chessBoard = [BOARD_HEIGHT][BOARD_WIDTH];
var IS_GAME_END = false;
const CHARIOT = 90; // xe
const CANON = 50; // pháo
const GENERAL = 999999; // tướng
const SOLDIER_BEFORE = 10; // tốt trước khi sang sông
const SOLDIER_AFTER = 15; // tốt sau khi sang sông
const ELEPHANT = 25; // tượng
const ADVISOR = 20; // sĩ
const HORSE = 40; // mã
const SOLDIER_BEFORE_CROSSING_RIVER_RED = 10.01;
const SOLDIER_BEFORE_CROSSING_RIVER_BLACK = 10.02;
const SOLIDER_AFTER_CROSSING_RIVER_RED = 15.01;
const SOLIDER_AFTER_CROSSING_RIVER_BLACK = 15.02;
const DARK = 1;
const RED = 0;

function main() {
  let computerSide = DARK; // bên máy màu đen
  initChessBoard();
  chessBoard = chess;
  let score = 0;
  console.log(score);
  while (true) {
    chessBoard[parseInt(chessRow)][parseInt(chessCol)] = chessBoard[parseInt(fromChessRow)][parseInt(fromChessCol)];
    chessBoard[parseInt(fromChessRow)][parseInt(fromChessCol)] = EMPTY;
    minimax(5, chessBoard, 0, true, -Number.MAX_VALUE, Number.MAX_VALUE, true);

    let finalFromRow = finalMovement.getFromRow();
    let finalFromCol = finalMovement.getFromCol();
    let finalDestRow = finalMovement.getDestRow();
    let finalDestCol = finalMovement.getDestCol();

    chessBoard[finalDestRow][finalDestCol] = chessBoard[finalFromRow][finalFromCol];
    chessBoard[finalFromRow][finalFromCol] = EMPTY;
    for (let i = 1; i <= BOARD_HEIGHT; i++) {
      for (let j = 1; j <= BOARD_WIDTH; j++) {
        console.log(chessBoard[i][j] + "   ");
      }
    }

    if (IS_GAME_END == true) {
      alert("GAME END at");
      break;
    }
  }
}

function tryMakeMove(chessBoard, movement) {
  let fromRow = movement.getFromRow();
  let fromCol = movement.getFromCol();
  let destRow = movement.getDestRow();
  let destCol = movement.getDestCol();
  chessBoard[destRow][destCol] = chessBoard[fromRow][fromCol];
  chessBoard[fromRow][fromCol] = EMPTY;
}

function backTrack(chessBoard, movement) {
}

function initChessBoard() {
  initChessPosition();
}

function isWhiteSide(piece) {
  return standardizedValue(piece) == 0.01;
}

function standardizedValue(value) {
  // 0.23000000000333 to 0.23
  return (int)(Math.round((value - Math.floor(value)) * 100)) / 100.0;
}

function hasEnemy(i, j, isWhite) {
  if (isWhite) {
    if (standardizedValue(chessBoard[i][j]) == 0.02) {
      return true;
    }
  } else {
    if (standardizedValue(chessBoard[i][j]) == 0.01) {
      return true;
    }
  }
  return false;
}

function checkPositionOfGeneral(i, j, isWhite) {
  if (!isWhite) {
    if (i < BOARD_HEIGHT && i >= BOARD_HEIGHT - 3 && j >= BOARD_WIDTH / 2 - 1 && j <= BOARD_WIDTH / 2 + 1) {
      return true;
    }
  } else {
    if ((i <= 2 && i >= 0) && (j >= BOARD_WIDTH / 2 - 1 && j <= BOARD_WIDTH / 2 + 1)) {
      return true;
    }
  }
  return false;
}

function checkPositionOfAdvisor(i, j, isWhite) {
  if (!isWhite) {
    if ((i == 9 && (j == 3 || j == 5)) || (i == 8 && j == 4) || (i == 7 && (j == 3 || j == 5))) {
      return true;
    }
  } else {
    if ((i == 0 && (j == 3 || j == 5)) || (i == 1 && j == 4) || (i == 2 && (j == 3 || j == 5))) {
      return true;
    }
  }
  return false;
}

function checkPositionOfElephant(i, j, isWhite) {
  if (!isWhite) {
    if ((i == 9 && (j == 2 || j == 6)) || (i == 7 && (j == 4 || j == 0 || j == 8))
      || (i == 5 && (j == 2 || j == 6))) {
      return true;
    }
  } else {
    if ((i == 0 && (j == 2 || j == 6)) || (i == 2 && (j == 4 || j == 0 || j == 8))
      || (i == 4 && (j == 2 || j == 6))) {
      return true;
    }
  }
  return false;
}

function checkPositionOfHorse(fromRow, fromCol, destRow, destCol) {
  if ((destRow == fromRow + 1 || destRow == fromRow - 1) && destCol == fromCol + 2
    && chessBoard[fromRow][fromCol + 1] == EMPTY) {
    return true;
  } else if ((destRow == fromRow + 1 || destRow == fromRow - 1) && destCol == fromCol - 2
    && chessBoard[fromRow][fromCol - 1] == EMPTY) {
    return true;
  } else if (destRow == fromRow + 2 && (destCol == fromCol + 1 || destCol == fromCol - 1)
    && chessBoard[fromRow + 1][fromCol] == EMPTY) {
    return true;
  } else if (destRow == fromRow - 2 && (destCol == fromCol + 1 || destCol == fromCol - 1)
    && chessBoard[fromRow - 1][fromCol] == EMPTY) {
    return true;
  }
  return false;
}

function generateMovement(chessBoard, movement, level, numberOfBranch, isWhite) {
  numberOfBranch[level] = 0;
  // for each piece in chess board
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      chess = chessBoard[i][j];

      if (chessBoard[i][j] != EMPTY) {
        if (isWhite) {
          if (isWhiteSide(chess)) {
            switch (parseInt(Math.floor(chess))) {
              case CHARIOT:
                genChariotMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case CANON:
                genCanonMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case GENERAL:
                genGeneralMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case SOLDIER_BEFORE:
                genSoldierBeforeMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case SOLDIER_AFTER:
                genSoldierAfterMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case ADVISOR:
                genAdvisorMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case ELEPHANT:
                genElephantMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case HORSE:
                genHorseMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
            }

          }
        } else {
          if (!isWhiteSide(chess)) {
            switch (parseInt(Math.floor(chess))) {
              case CHARIOT:
                genChariotMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case CANON:
                genCanonMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case GENERAL:
                genGeneralMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case SOLDIER_BEFORE:
                genSoldierBeforeMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case SOLDIER_AFTER:
                genSoldierAfterMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case ADVISOR:
                genAdvisorMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case ELEPHANT:
                genElephantMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
              case HORSE:
                genHorseMovement(i, j, numberOfBranch, movement, level, isWhite);
                break;
            }
          }
        }
      }
    }
  }
}

function genCanonMovement(i, j, numberOfBranch, movement, level, isWhite) {
  let chessRow = i;
  let chessCol = j;
  // To bottom
  // tìm ngòi
  for (let k = i + 1; k < BOARD_HEIGHT - 1; k++) {
    if (chessBoard[k][j] != EMPTY) {
      for (let k2 = k + 1; k2 < BOARD_HEIGHT; k2++) {
        if (hasEnemy(k2, j, isWhite)) {
          let move = new Movement();
          move.setFrom(i, j);
          move.setDest(k2, j);
          movement[numberOfBranch[level]] = move;
          numberOfBranch[level]++;
          break;
        }
      }
      break;
    }
  }
  while (chessRow < BOARD_HEIGHT) {
    chessRow++;
    if (chessRow == BOARD_HEIGHT) {
      chessRow = i;
      break;
    }
    if (chessBoard[chessRow][j] == EMPTY) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, j);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      break;
    }
  }
  // To top
  // tìm ngòi
  for (let k = i - 1; k > 0; k--) {
    if (chessBoard[k][j] != EMPTY) {
      for (let k2 = k - 1; k2 >= 0; k2--) {
        if (hasEnemy(k2, j, isWhite)) {
          let move = new Movement();
          move.setFrom(i, j);
          move.setDest(k2, j);
          movement[numberOfBranch[level]] = move;
          numberOfBranch[level]++;
          break;
        }
      }
      break;
    }
  }
  while (chessRow >= 0) {
    chessRow--;
    if (chessRow < 0) {
      chessRow = i;
      break;
    }
    if (chessBoard[chessRow][j] == EMPTY) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, j);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      break;
    }
  }
  // To right
  // tìm ngòi
  for (let k = j + 1; k < BOARD_WIDTH - 1; k++) {
    if (chessBoard[i][k] != EMPTY) {
      for (let k2 = k + 1; k2 < BOARD_WIDTH; k2++) {
        if (hasEnemy(i, k2, isWhite)) {
          let move = new Movement();
          move.setFrom(i, j);
          move.setDest(i, k2);
          movement[numberOfBranch[level]] = move;
          numberOfBranch[level]++;
          break;
        }
      }
      break;
    }
  }
  while (chessCol < BOARD_WIDTH) {
    chessCol++;
    if (chessCol == BOARD_WIDTH) {
      chessCol = j;
      break;
    }
    if (chessBoard[i][chessCol] == EMPTY) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(i, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessCol = j;
      break;
    }
  }
  // To left
  // tìm ngòi
  for (let k = j - 1; k > 0; k--) {
    if (chessBoard[i][k] != EMPTY) {
      for (let k2 = k - 1; k2 >= 0; k2--) {
        if (hasEnemy(i, k2, isWhite)) {
          let move = new Movement();
          move.setFrom(i, j);
          move.setDest(i, k2);
          movement[numberOfBranch[level]] = move;
          numberOfBranch[level]++;
          break;
        }
      }
      break;
    }
  }
  while (chessCol >= 0) {
    chessCol--;
    if (chessCol < 0) {
      chessCol = j;
      break;
    }
    if (chessBoard[i][chessCol] == EMPTY) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(i, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessCol = j;
      break;
    }
  }
}

function genHorseMovement(i, j, numberOfBranch, movement, level, isWhite) {
  let chessRow = i;
  let chessCol = j;
  // To bottom left
  chessRow++;
  chessCol -= 2;
  if (chessRow < BOARD_HEIGHT && chessCol >= 0) {
    if (checkPositionOfHorse(i, j, chessRow, chessCol)
      && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      chessCol = j;
    }
  } else {
    chessRow = i;
    chessCol = j;
  }

  chessRow = i;
  chessCol = j;
  chessRow += 2;
  chessCol--;
  if (chessRow < BOARD_HEIGHT && chessCol >= 0) {
    if (checkPositionOfHorse(i, j, chessRow, chessCol)
      && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      chessCol = j;
    }
  } else {
    chessRow = i;
    chessCol = j;
  }

  // To bottom right
  chessRow = i;
  chessCol = j;
  chessRow++;
  chessCol += 2;
  if (chessRow < BOARD_HEIGHT && chessCol < BOARD_WIDTH) {
    if (checkPositionOfHorse(i, j, chessRow, chessCol)
      && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      chessCol = j;
    }
  } else {
    chessRow = i;
    chessCol = j;
  }

  chessRow = i;
  chessCol = j;
  chessRow += 2;
  chessCol++;
  if (chessRow < BOARD_HEIGHT && chessCol < BOARD_WIDTH) {
    if (checkPositionOfHorse(i, j, chessRow, chessCol)
      && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      chessCol = j;
    }
  } else {
    chessRow = i;
    chessCol = j;
  }

  // To top left
  chessRow = i;
  chessCol = j;
  chessRow--;
  chessCol -= 2;
  if (chessRow >= 0 && chessCol >= 0) {
    if (checkPositionOfHorse(i, j, chessRow, chessCol)
      && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      chessCol = j;
    }
  } else {
    chessRow = i;
    chessCol = j;
  }

  chessRow = i;
  chessCol = j;
  chessRow -= 2;
  chessCol--;
  if (chessRow >= 0 && chessCol >= 0) {
    if (checkPositionOfHorse(i, j, chessRow, chessCol)
      && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      chessCol = j;
    }
  } else {
    chessRow = i;
    chessCol = j;
  }

  // To top right
  chessRow = i;
  chessCol = j;
  chessRow--;
  chessCol += 2;
  if (chessRow >= 0 && chessCol < BOARD_WIDTH) {
    if (checkPositionOfHorse(i, j, chessRow, chessCol)
      && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      chessCol = j;
    }
  } else {
    chessRow = i;
    chessCol = j;
  }

  chessRow = i;
  chessCol = j;
  chessRow -= 2;
  chessCol++;
  if (chessRow >= 0 && chessCol < BOARD_WIDTH) {
    if (checkPositionOfHorse(i, j, chessRow, chessCol)
      && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      chessCol = j;
    }
  } else {
    chessRow = i;
    chessCol = j;
  }
}

function genElephantMovement(i, j, numberOfBranch, movement, level,
  isWhite) {
  let chessRow = i;
  let chessCol = j;
  // To bottom left
  if (chessRow < BOARD_HEIGHT && chessCol >= 0) {
    chessRow += 2;
    chessCol -= 2;
    if (chessRow >= BOARD_HEIGHT || chessCol < 0) {
      chessRow = i;
      chessCol = j;
      //				break;
    }
    if (chessRow != i && chessCol != j) {
      if (checkPositionOfElephant(chessRow, chessCol, isWhite) && chessBoard[i + 1][j - 1] == EMPTY
        && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        chessCol = j;
        //				break;
      }
    }
  }
  // To bottom right
  chessRow = i;
  chessCol = j;
  if (chessRow < BOARD_HEIGHT && chessCol < BOARD_WIDTH) {
    chessRow += 2;
    chessCol += 2;
    if (chessRow >= BOARD_HEIGHT || chessCol >= BOARD_WIDTH) {
      chessRow = i;
      chessCol = j;
      //				break;
    }
    if (chessRow != i && chessCol != j) {
      if (checkPositionOfElephant(chessRow, chessCol, isWhite) && chessBoard[i + 1][j + 1] == EMPTY
        && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        chessCol = j;
        //				break;
      }
    }
  }
  // To top left
  chessRow = i;
  chessCol = j;
  if (chessRow >= 0 && chessCol >= 0) {
    chessRow -= 2;
    chessCol -= 2;
    if (chessRow < 0 || chessCol < 0) {
      chessRow = i;
      chessCol = j;
      //				break;
    }
    if (chessRow != i && chessCol != j) {
      if (checkPositionOfElephant(chessRow, chessCol, isWhite) && chessBoard[i - 1][j - 1] == EMPTY
        && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        chessCol = j;
        //				break;
      }
    }
  }
  // To top right
  chessRow = i;
  chessCol = j;
  if (chessRow >= 0 && chessCol < BOARD_WIDTH) {
    chessRow -= 2;
    chessCol += 2;
    if (chessRow < 0 || chessCol >= BOARD_WIDTH) {
      chessRow = i;
      chessCol = j;
      //				break;
    }
    if (chessRow != i && chessCol != j) {
      if (checkPositionOfElephant(chessRow, chessCol, isWhite) && chessBoard[i - 1][j + 1] == EMPTY
        && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        chessCol = j;
        //				break;
      }
    }
  }
}

function genAdvisorMovement(i, j, numberOfBranch, movement, level,
  isWhite) {
  let chessRow = i;
  let chessCol = j;
  // To bottom left
  if (chessRow < BOARD_HEIGHT && chessCol >= 3) {
    chessRow++;
    chessCol--;
    if (chessRow >= BOARD_HEIGHT || chessCol < 3) {
      chessRow = i;
      chessCol = j;
      //				break;
    }
    if (chessRow != i && chessCol != j) {
      if (checkPositionOfAdvisor(chessRow, chessCol, isWhite)
        && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        chessCol = j;
        //				break;
      }
    }
  }
  // To bottom right
  chessRow = i;
  chessCol = j;
  if (chessRow < BOARD_HEIGHT && chessCol <= 5) {
    chessRow++;
    chessCol++;
    if (chessRow >= BOARD_HEIGHT || chessCol > 5) {
      chessRow = i;
      chessCol = j;
      //				break;
    }
    if (chessRow != i && chessCol != j) {
      if (checkPositionOfAdvisor(chessRow, chessCol, isWhite)
        && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        chessCol = j;
        //				break;
      }
    }
  }
  // To top left
  chessRow = i;
  chessCol = j;
  if (chessRow >= 0 && chessCol >= 3) {
    chessRow--;
    chessCol--;
    if (chessRow < 0 || chessCol < 3) {
      chessRow = i;
      chessCol = j;
      //				break;
    }
    if (chessRow != i && chessCol != j) {
      if (checkPositionOfAdvisor(chessRow, chessCol, isWhite)
        && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        chessCol = j;
        //				break;
      }
    }
  }
  // To top right
  chessRow = i;
  chessCol = j;
  if (chessRow >= 0 && chessCol <= 5) {
    chessRow--;
    chessCol++;
    if (chessRow < 0 || chessCol > 5) {
      chessRow = i;
      chessCol = j;
      //				break;
    }
    if (chessRow != i && chessCol != j) {
      if (checkPositionOfAdvisor(chessRow, chessCol, isWhite)
        && (chessBoard[chessRow][chessCol] == EMPTY || hasEnemy(chessRow, chessCol, isWhite))) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        chessCol = j;
        //				break;
      }
    }
  }
}

function genChariotMovement(i, j, numberOfBranch, movement, level,
  isWhite) {
  let chessRow = i;
  let chessCol = j;
  // To bottom
  while (chessRow < BOARD_HEIGHT) {
    chessRow++;
    if (chessRow == BOARD_HEIGHT) {
      chessRow = i;
      break;
    }

    if (chessBoard[chessRow][j] == EMPTY || hasEnemy(chessRow, j, isWhite)) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, j);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      break;
    }
  }
  // To top
  while (chessRow >= 0) {
    chessRow--;
    if (chessRow < 0) {
      chessRow = i;
      break;
    }
    if (chessBoard[chessRow][j] == EMPTY || hasEnemy(chessRow, j, isWhite)) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, j);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      break;
    }
  }
  // To right
  while (chessCol < BOARD_WIDTH) {
    chessCol++;
    if (chessCol == BOARD_WIDTH) {
      chessCol = j;
      break;
    }
    if (chessBoard[i][chessCol] == EMPTY || hasEnemy(i, chessCol, isWhite)) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(i, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessCol = j;
      break;
    }
  }
  // To left
  while (chessCol >= 0) {
    chessCol--;
    if (chessCol < 0) {
      chessCol = j;
      break;
    }
    if (chessBoard[i][chessCol] == EMPTY || hasEnemy(i, chessCol, isWhite)) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(i, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessCol = j;
      break;
    }
  }
}

function genGeneralMovement(i, j, numberOfBranch, movement, level,
  isWhite) {
  let chessRow = i;
  let chessCol = j;
  // To bottom
  //		while (chessRow < BOARD_HEIGHT) {
  chessRow++;
  if (chessRow >= BOARD_HEIGHT || (chessRow < 7 && chessRow >= 3)) {
    chessRow = i;
    //				break;
  }
  if (chessRow != i) {
    if (checkPositionOfGeneral(chessRow, j, isWhite)
      && (chessBoard[chessRow][j] == EMPTY || hasEnemy(chessRow, j, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, j);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      //				break;
    }
  }
  //		}
  // To top
  //		while (chessRow >= 0) {
  chessRow = i;
  chessCol = j;
  chessRow--;
  if (chessRow < 0 || (chessRow < 7 && chessRow >= 3)) {
    chessRow = i;
    //				break;
  }
  if (chessRow != i) {
    if (checkPositionOfGeneral(chessRow, j, isWhite)
      && (chessBoard[chessRow][j] == EMPTY || hasEnemy(chessRow, j, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, j);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessRow = i;
      //				break;
    }
  }
  // To right
  //		while (chessCol < BOARD_WIDTH) {
  chessRow = i;
  chessCol = j;
  chessCol++;
  if (chessCol < 3 || chessCol > 5) {
    chessCol = j;
    //				break;
  }
  if (chessCol != j) {
    if (checkPositionOfGeneral(chessRow, j, isWhite)
      && (chessBoard[i][chessCol] == EMPTY || hasEnemy(i, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(i, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessCol = j;
    }
  }
  // To left
  //		while (chessCol >= 0) {
  chessRow = i;
  chessCol = j;
  chessCol--;
  if (chessCol < 3 || chessCol > 5) {
    chessCol = j;
    //				break;
  }
  if (chessCol != j) {
    if (checkPositionOfGeneral(chessRow, j, isWhite)
      && (chessBoard[i][chessCol] == EMPTY || hasEnemy(i, chessCol, isWhite))) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(i, chessCol);
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    } else {
      chessCol = j;
    }
  }
}

function genSoldierBeforeMovement(i, j, numberOfBranch, movement, level,
  isWhite) {
  let chessRow = i;
  let chessCol = j;
  // To bottom
  if (isWhite) {
    chessRow++;
    if (chessBoard[chessRow][j] == EMPTY || hasEnemy(chessRow, j, isWhite)) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, j);

      if (chessRow >= BOARD_HEIGHT / 2) {
        move.setSoliderMovement(true);
      }
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    }
  }
  // To top
  else {
    chessRow--;
    if (chessBoard[chessRow][j] == EMPTY || hasEnemy(chessRow, j, !isWhite)) {
      let move = new Movement();
      move.setFrom(i, j);
      move.setDest(chessRow, j);
      if (chessRow < BOARD_HEIGHT / 2) {
        move.setSoliderMovement(true);
      }
      movement[numberOfBranch[level]] = move;
      numberOfBranch[level]++;
    }
  }
}

function genSoldierAfterMovement(i, j, numberOfBranch, movement, level,
  isWhite) {
  let chessRow = i;
  let chessCol = j;
  // To bottom
  if (chessRow < BOARD_HEIGHT && isWhite) {
    chessRow++;
    if (chessRow == BOARD_HEIGHT) {
      chessRow = i;
      //				break;
    }
    if (chessRow != i) {
      if (chessBoard[chessRow][j] == EMPTY || hasEnemy(chessRow, j, isWhite)) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, j);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        //				break;
      }
    }
  }

  // To top
  chessRow = i;
  chessCol = j;
  if (chessRow >= 0 && !isWhite) {
    chessRow--;
    if (chessRow < 0) {
      chessRow = i;
      //				break;
    }
    if (chessRow != i) {
      if (chessBoard[chessRow][j] == EMPTY || hasEnemy(chessRow, j, isWhite)) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(chessRow, j);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessRow = i;
        //				break;
      }
    }
  }
  // To right
  chessRow = i;
  chessCol = j;
  if (chessCol < BOARD_WIDTH) {
    chessCol++;
    if (chessCol == BOARD_WIDTH) {
      chessCol = j;
      //				break;
    }
    if (chessCol != j) {
      if (chessBoard[i][chessCol] == EMPTY || hasEnemy(i, chessCol, isWhite)) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(i, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessCol = j;
      }
    }
  }
  // To left
  chessRow = i;
  chessCol = j;
  if (chessCol >= 0) {
    chessCol--;
    if (chessCol < 0) {
      chessCol = j;
      //				break;
    }
    if (chessCol != j) {
      if (chessBoard[i][chessCol] == EMPTY || hasEnemy(i, chessCol, isWhite)) {
        let move = new Movement();
        move.setFrom(i, j);
        move.setDest(i, chessCol);
        movement[numberOfBranch[level]] = move;
        numberOfBranch[level]++;
      } else {
        chessCol = j;
      }
    }
  }
}

function evaluate(chessBoard) {
  let score1 = 0;
  let score2 = 0;
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    for (let j = 0; j < BOARD_WIDTH; j++) {
      if (isWhiteSide(chessBoard[i][j])) {
        score1 += parseInt(Math.floor(chessBoard[i][j]));
      } else {
        score2 -= parseInt(Math.floor(chessBoard[i][j]));
      }

    }
  }

  return score1 + score2;
}

function minimax(depth, temp, level, isMaximizingPlayer, alpha, beta,
  isWhite) {
  let chessBoard = new double[BOARD_HEIGHT][BOARD_WIDTH];
  for (let i = 0; i < chessBoard.length; i++) {
    for (let j = 0; j < chessBoard[i].length; j++) {
      chessBoard[i][j] = temp[i][j];
    }
  }
  let numberOfBranch = new int[50];
  let movement = new Movement[200];
  if (depth == 0) {
    return evaluate(chessBoard);
  }
  generateMovement(chessBoard, movement, level, numberOfBranch, isWhite);
  if (isMaximizingPlayer) {
    let bestValue = -Integer.MAX_VALUE;
    for (let k = 0; k < numberOfBranch[level]; k++) {
      // try
      let enemyChessValue = 0;
      let fromRow = movement[k].getFromRow();
      let fromCol = movement[k].getFromCol();
      let destRow = movement[k].getDestRow();
      let destCol = movement[k].getDestCol();
      if (hasEnemy(destRow, destCol, isWhite)) {
        enemyChessValue = chessBoard[destRow][destCol];
      }
      chessBoard[destRow][destCol] = chessBoard[fromRow][fromCol];
      chessBoard[fromRow][fromCol] = EMPTY;
      if (movement[k].isSoliderMovement()) {
        chessBoard[destRow][destCol] = SOLIDER_AFTER_CROSSING_RIVER_WHITE;
      }
      let value;
      if (chessBoard[destRow][destCol] == 999999.02) {
        IS_GAME_END = true;
        value = 1000 - level;
      } else {
        value = minimax(depth - 1, chessBoard, level + 1, false, alpha, beta, !isWhite);
      }
      if (value > bestValue) {
        bestValue = Math.max(bestValue, value);
        if (level == 0) {
          finalMovement.setFrom(fromRow, fromCol);
          finalMovement.setDest(destRow, destCol);
        }
      }

      alpha = Math.max(alpha, bestValue);

      // backtrack
      chessBoard[fromRow][fromCol] = chessBoard[destRow][destCol];
      chessBoard[destRow][destCol] = enemyChessValue;
      if (movement[k].isSoliderMovement()) {
        chessBoard[destRow][destCol] = SOLDIER_BEFORE_CROSSING_RIVER_WHITE;
      }
      if (beta <= alpha) {
        break;
      }
    }
    return bestValue;
  } else {
    let worstValue = Integer.MAX_VALUE;
    for (let k = 0; k < numberOfBranch[level]; k++) {
      // try
      let enemyChessValue = 0;
      let fromRow = movement[k].getFromRow();
      let fromCol = movement[k].getFromCol();
      let destRow = movement[k].getDestRow();
      let destCol = movement[k].getDestCol();
      if (hasEnemy(destRow, destCol, isWhite)) {
        enemyChessValue = chessBoard[destRow][destCol];
      }
      chessBoard[destRow][destCol] = chessBoard[fromRow][fromCol];
      chessBoard[fromRow][fromCol] = EMPTY;
      if (movement[k].isSoliderMovement()) {
        chessBoard[destRow][destCol] = SOLIDER_AFTER_CROSSING_RIVER_BLACK;
      }
      let value = minimax(depth - 1, chessBoard, level + 1, true, alpha, beta, !isWhite);

      if (value < worstValue) {
        if (value == 1000489) {
          System.out.println();
        }
        worstValue = Math.min(value, worstValue);
      }
      beta = Math.min(worstValue, beta);

      // backtrack
      chessBoard[fromRow][fromCol] = chessBoard[destRow][destCol];
      chessBoard[destRow][destCol] = enemyChessValue;
      if (movement[k].isSoliderMovement()) {
        chessBoard[destRow][destCol] = SOLDIER_BEFORE_CROSSING_RIVER_WHITE;
      }
      if (alpha >= beta) {
        break;
      }
    }
    return worstValue;
  }
}

function initChessPosition() {
  for (let i = 1; i <= BOARD_HEIGHT; i++) {
    for (let j = 1; j <= BOARD_WIDTH; j++) {
      chess[i][j] = 0;
    }
  }

  // Declare white chess value
  let GENERAL_RED = 999999.01; // tướng
  let ADVISOR_RED = 20.01; // sĩ
  let ELEPHANT_RED = 25.01; // tượng
  let HORSE_RED = 40.01; // mã
  let CHARIOT_RED = 90.01; // xe
  let CANON_RED = 50.01; // pháo
  let SOLDIER_BEFORE_CROSSING_RIVER_RED = 10.01; // tốt trước khi qua sông
  let SOLIDER_AFTER_CROSSING_RIVER_RED = 15.01; // tốt sau khi qua sông
  let EMPTY_RED = 0.01;

  // Declare black chess value
  let GENERAL_BLACK = 999999.02;
  let ADVISOR_BLACK = 20.02;
  let ELEPHANT_BLACK = 25.02;
  let HORSE_BLACK = 40.02;
  let CHARIOT_BLACK = 90.02;
  let CANON_BLACK = 50.02;
  let SOLDIER_BEFORE_CROSSING_RIVER_BLACK = 10.02;
  let SOLIDER_AFTER_CROSSING_RIVER_BLACK = 15.02;
  let EMPTY_BLACK = 0.02;

  chess[0][0] = CHARIOT_RED;
  chess[0][1] = HORSE_RED;
  chess[0][2] = ELEPHANT_RED;
  chess[0][3] = ADVISOR_RED;
  chess[0][4] = GENERAL_RED;
  chess[0][5] = ADVISOR_RED;
  chess[0][6] = ELEPHANT_RED;
  chess[0][7] = HORSE_RED;
  chess[0][8] = CHARIOT_RED;

  chess[9][0] = CHARIOT_BLACK;
  chess[9][1] = HORSE_BLACK;
  chess[9][2] = ELEPHANT_BLACK;
  chess[9][3] = ADVISOR_BLACK;
  chess[9][4] = GENERAL_BLACK;
  chess[9][5] = ADVISOR_BLACK;
  chess[9][6] = ELEPHANT_BLACK;
  chess[9][7] = HORSE_BLACK;
  chess[9][8] = CHARIOT_BLACK;

  for (let i = 1; i <= BOARD_WIDTH; i += 2) {
    chess[3][i] = SOLDIER_BEFORE_CROSSING_RIVER_RED;
    chess[6][i] = SOLDIER_BEFORE_CROSSING_RIVER_BLACK;
  }


  chess[2][1] = CANON_RED;
  chess[2][7] = CANON_RED;
  chess[7][1] = CANON_BLACK;

  chess[7][7] = CANON_BLACK;
}
