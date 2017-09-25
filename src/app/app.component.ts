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

  generateSolution(gridInfo: GridInfo) {

  }

  setDifficulty(gridInfo: GridInfo) {

  }
}
