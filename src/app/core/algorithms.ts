import { Move, GridInfo, Cell } from './models';

interface IRecursiveAlgorightm {
  recursiveMove(cell: Cell, finalCell?: Cell);
  generateSolution(): Promise<Cell[][]>;
}

export class RecursiveAlgorightm implements IRecursiveAlgorightm {
  constructor(public gridInfo, public processGrid: Cell[][]) { }
  recursiveMove(cell: Cell, finalCell?: Cell) {
    throw new Error('Method not implemented.');
  }
  generateSolution(): Promise<Cell[][]> {
    throw new Error('Method not implemented.');
  }
}

export class BackTracking extends RecursiveAlgorightm implements IRecursiveAlgorightm {
  private allowedBaseMoves: Move[] = [];

  constructor(public gridInfo: GridInfo, public processGrid: Cell[][]) {
    super(gridInfo, processGrid);

    // Set allowed Moves
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        this.allowedBaseMoves.push(new Move(row, col));
      }
    }
    this.allowedBaseMoves.splice(4, 1);
  }
  async generateSolution(): Promise<Cell[][]> {
    // Get random starting cell positions
    const randomCol = Math.round(Math.random() * this.gridInfo.colIndexes);
    const randomRow = Math.round(Math.random() * this.gridInfo.rowIndexes);

    // Get starting cell
    const startCell = this.processGrid[ randomRow ][ randomCol ];

    // Initialize starting cell
    startCell.value = 1;
    startCell.isEdge = true;
    startCell.showValue();

    await this.recursiveMove(startCell);

    return this.processGrid;
  }

  async recursiveMove(cell: Cell) {
    if (cell.value === this.gridInfo.quantity) {
      cell.isEdge = true;
      cell.showValue();
      return true;
    }

    const movesAllowed = this.getAllowedMoves(cell);

    while (movesAllowed.length !== 0) {
      const moveIndex = Math.round(Math.random() * (movesAllowed.length - 1));
      const allowedMove = movesAllowed.splice(moveIndex, 1)[ 0 ];
      const dir = this.calculateMoveIndex(cell, allowedMove);
      const cellMove = this.processGrid[ dir.row ][ dir.col ];
      cellMove.value = cell.value + 1;
      if (await this.recursiveMove(cellMove)) {
        // cell.showValue();
        return true;
      }
      cellMove.value = 0;
    }
    return false;
  }

  /**
   * Verify which moves are allowed from the cell passed as parameter
   *
   * @param {Cell} cell
   * @returns
   * @memberof AppComponent
   */
  getAllowedMoves(cell: Cell) {
    const allowedMoves: Move[] = [];
    for (const move of this.allowedBaseMoves) {
      // Get move direction indexes
      const dir = this.calculateMoveIndex(cell, move);

      // Check table boundaries
      if (
        dir.row < 0 ||
        dir.row > this.gridInfo.rowIndexes ||
        dir.col < 0 ||
        dir.col > this.gridInfo.colIndexes
      ) continue;

      // Check move cell is empty
      const cellMove = this.processGrid[ dir.row ][ dir.col ];
      if (cellMove.value !== 0) continue;

      allowedMoves.push(move);
    }

    return allowedMoves;
  }

  calculateMoveIndex(cell: Cell, move: Move) {
    return {
      row: cell.row + move.row,
      col: cell.col + move.col,
    };
  }
}

export class SpiralMatrix extends RecursiveAlgorightm implements IRecursiveAlgorightm {
  recursiveMove(cell: Cell) {
    throw new Error('Method not implemented.');
  }
  generateSolution(): Promise<Cell[][]> {
    throw new Error('Method not implemented.');
  }
}

export class GreedyMatrix extends RecursiveAlgorightm implements IRecursiveAlgorightm {
  private allowedBaseMoves: Move[] = [];

  constructor(public gridInfo: GridInfo, public processGrid: Cell[][]) {
    super(gridInfo, processGrid);

    // Set allowed Moves
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        this.allowedBaseMoves.push(new Move(row, col));
      }
    }
    this.allowedBaseMoves.splice(4, 1);
  }
  async generateSolution(): Promise<Cell[][]> {
    // Get random starting and finishing cell positions
    const randomColStart = Math.round(Math.random() * this.gridInfo.colIndexes);
    const randomRowStart = Math.round(Math.random() * this.gridInfo.rowIndexes);
    const randomColFinal = Math.round(Math.random() * this.gridInfo.colIndexes);
    const randomRowFinal = Math.round(Math.random() * this.gridInfo.rowIndexes);

    // Get starting and finishing cell
    const startCell = this.processGrid[ randomRowStart ][ randomColStart ];
    const finalCell = this.processGrid[ randomRowFinal ][ randomColFinal ];

    // Initialize starting and finishing cell
    startCell.value = 1;
    startCell.isEdge = true;
    startCell.showValue();

    finalCell.value = this.gridInfo.quantity;
    finalCell.isEdge = true;
    finalCell.showValue();


    await this.recursiveMove(startCell, finalCell);

    return this.processGrid;
  }

  async recursiveMove(cell: Cell, finalCell: Cell) {
    if (cell.value === this.gridInfo.quantity - 1) {
      return true;
    }

    const movesAllowed = this.getAllowedMoves(cell);

    const cellMove = this.greaterDistance(cell, finalCell, movesAllowed);
    cellMove.value = cell.value + 1;

    setTimeout(() => this.recursiveMove(cellMove, finalCell), 0);
  }

  greaterDistance(cell: Cell, finalCell: Cell, allowedBaseMoves: Move[]) {
    let lastCell: Cell;
    let maxDistance = 0;
    for (let i = 0; i < allowedBaseMoves.length; i++) {
      const cellMove = this.getCellAtMove(cell, allowedBaseMoves[i]);
      const distance = this.distance(cellMove, finalCell);
      if (distance > maxDistance) {
        lastCell = cellMove;
        maxDistance = distance;
      }
    }
    return lastCell;
  }

  distance(cell: Cell, finalCell: Cell): number {
    return Math.sqrt(Math.pow((finalCell.row - cell.row), 2) + Math.pow((finalCell.col - cell.col), 2));
  }

  getCellAtMove(cell: Cell, move: Move) {
    return this.processGrid[cell.row + move.row][cell.col + move.col];
  }

  getAllowedMoves(cell: Cell) {
    const allowedMoves: Move[] = [];
    for (const move of this.allowedBaseMoves) {
      // Get move direction indexes
      const dir = this.calculateMoveIndex(cell, move);

      // Check table boundaries
      if (
        dir.row < 0 ||
        dir.row > this.gridInfo.rowIndexes ||
        dir.col < 0 ||
        dir.col > this.gridInfo.colIndexes
      ) continue;

      // Check move cell is empty
      const cellMove = this.processGrid[ dir.row ][ dir.col ];
      if (cellMove.value !== 0) continue;

      allowedMoves.push(move);
    }

    return allowedMoves;
  }

  calculateMoveIndex(cell: Cell, move: Move) {
    return {
      row: cell.row + move.row,
      col: cell.col + move.col,
    };
  }
}

