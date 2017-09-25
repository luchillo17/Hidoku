import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Cell, formErrors, GridInfo, allowedBaseMoves } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form: FormGroup;
  errors = formErrors;

  gridInfo: GridInfo;
  startCell: Cell;
  hidokuGrid = [];

  constructor(fb: FormBuilder) {
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

  generateHidoku() {
    if (this.form.invalid) {
      return;
    }

    this.gridInfo = new GridInfo({
      rows: this.form.value.rows - 1,
      cols: this.form.value.cols - 1,
      dificulty: this.form.value.dificulty,
    });

    // Generates a matrix
    this.generateGrid();

    // Generates a valid solution
    this.generateSolution();

    // Hides cells based on dificulty
    this.setDifficulty();
  }

  /**
   * Generates a grid with empty cells.
   *
   * @memberof AppComponent
   */
  generateGrid() {
    this.hidokuGrid = [];
    for (let row = 0; row <= this.gridInfo.rows; row++) {
      this.hidokuGrid[row] = [];
      for (let col = 0; col <= this.gridInfo.cols; col++) {
        this.hidokuGrid[row][col] = new Cell(row, col);
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
    this.startCell = this.hidokuGrid[randomRow][randomCol];

    // Initialize starting cell
    this.startCell.value = 1;
    this.startCell.isEdge = true;
    this.startCell.showValue();

    console.log('====================================');
    console.log('Moves: ', allowedBaseMoves);
    console.log('====================================');


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
    const allowedMoves = [];

    for (const move of allowedBaseMoves) {
      // Get move direction indexes
      const rowDir = cell.row + move.row;
      const colDir = cell.col + move.col;

      // Check table boundaries
      if (
        rowDir < 0 ||
        rowDir > this.gridInfo.rows ||
        colDir < 0 ||
        colDir > this.gridInfo.cols
      ) continue;

      // Check move cell is empty
      const cellMove = this.hidokuGrid[rowDir][colDir];
      if (cellMove.value !== 0) return;

      allowedMoves.push(move);
    }

    return allowedMoves;
  }
}
