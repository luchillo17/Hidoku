import {TdLoadingService} from '@covalent/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Cell, formErrors, GridInfo, allowedBaseMoves, Move } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  errors = formErrors;

  gridInfo: GridInfo;
  startCell: Cell;
  hidokuGrid: Cell[][] = [];
  processGrid: Cell[][] = [];

  constructor(
    fb: FormBuilder,
    private _loadingService: TdLoadingService,
  ) {
    this.form = fb.group({
      rows: [null, [
        Validators.required,
        Validators.pattern(/\d+/),
        Validators.min(1),
      ]],
      cols: [null, [
        Validators.required,
        Validators.pattern(/\d+/),
        Validators.min(1),
      ]],
      dificulty: [2, [
        Validators.required,
        Validators.pattern(/\d+/),
        Validators.min(1),
        Validators.max(3),
      ]]
    });
  }

  ngOnInit() {
    this._loadingService.register('overlayStarSyntax');
  }

  generateHidoku() {
    if (this.form.invalid) {
      return;
    }

    this._loadingService.register('overlayStarSyntax');

    this.gridInfo = new GridInfo({
      rows: this.form.value.rows - 1,
      cols: this.form.value.cols - 1,
      dificulty: this.form.value.dificulty,
    });

    const startTime = new Date().getTime();
    console.time('generateHidoku');

    // Generates a matrix
    this.generateGrid();

    // Generates a valid solution
    this.generateSolution();

    // Hides cells based on dificulty
    this.setDifficulty();

    this.hidokuGrid = this.processGrid;

    console.log('====================================');
    console.timeEnd('generateHidoku');
    console.log('====================================');

    this._loadingService.resolveAll('overlayStarSyntax');
  }

  /**
   * Generates a grid with empty cells.
   *
   * @memberof AppComponent
   */
  generateGrid() {
    this.processGrid = [];
    for (let row = 0; row <= this.gridInfo.rows; row++) {
      this.processGrid[row] = [];
      for (let col = 0; col <= this.gridInfo.cols; col++) {
        this.processGrid[row][col] = new Cell(row, col);
      }
    }
  }

    /**
     * Backtracking part of the app, generates the
     * hidoku values for a valid solution.
     *
     * @memberof AppComponent
     */
  generateSolution() {
    // Get random starting cell positions
    const randomCol = Math.round(Math.random() * this.gridInfo.cols);
    const randomRow = Math.round(Math.random() * this.gridInfo.rows);

    // Get starting cell
    this.startCell = this.processGrid[randomRow][randomCol];

    // Initialize starting cell
    this.startCell.value = 1;
    this.startCell.isEdge = true;
    this.startCell.showValue();

    this.recursiveMove(this.startCell);
  }

  private recursiveMove(cell: Cell) {
    if (cell.value === this.gridInfo.quantity) {
      cell.isEdge = true;
      cell.showValue();
      return true;
    }

    const movesAllowed = this.getAllowedMoves(cell);

    while (movesAllowed.length !== 0) {
      const moveIndex = Math.round(Math.random() * (movesAllowed.length - 1));
      const allowedMove = movesAllowed.splice(moveIndex, 1)[0];
      const dir = this.calculateMoveIndex(cell, allowedMove);
      const cellMove = this.processGrid[dir.row][dir.col];
      cellMove.value = cell.value + 1;
      if (this.recursiveMove(cellMove)) {
        cell.showValue();
        return true;
      }
      cellMove.value = 0;
    }
    return false;
  }

  /**
   * Hides some cells based on the dificulty level.
   *
   * @memberof AppComponent
   */
  setDifficulty() {

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
    for (const move of allowedBaseMoves) {
      // Get move direction indexes
      const dir = this.calculateMoveIndex(cell, move);

      // Check table boundaries
      if (
        dir.row < 0 ||
        dir.row > this.gridInfo.rows ||
        dir.col < 0 ||
        dir.col > this.gridInfo.cols
      ) continue;

      // Check move cell is empty
      const cellMove = this.processGrid[dir.row][dir.col];
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
