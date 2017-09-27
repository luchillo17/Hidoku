import {TdLoadingService} from '@covalent/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';

import { Cell, formErrors, GridInfo, Move } from './core/models';
import { BackTracking, RecursiveAlgorightm, SpiralMatrix, GreedyMatrix } from './core/algorithms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('formData')
  formRef: NgForm;

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

  byGreedy() {
    this.generateHidoku(GreedyMatrix);
  }
  bySpiral() {
    this.generateHidoku(SpiralMatrix);
  }
  byBackTracking() {
    this.generateHidoku(BackTracking);
  }

  async generateHidoku(algorithmClass: typeof RecursiveAlgorightm) {
    if (this.form.invalid) {
      Object.values(this.form.controls)
        .forEach((control) => {
          control.markAsDirty();
          control.markAsTouched();
        });
      this.formRef.ngSubmit.emit();
      return;
    }

    this._loadingService.register('overlayStarSyntax');

    console.time('generateHidoku');

    const gridInfo = new GridInfo({
      rows: this.form.value.rows - 1,
      cols: this.form.value.cols - 1,
      dificulty: this.form.value.dificulty,
    });

    try {

      // Generates a matrix
      const grid = this.generateGrid(gridInfo);

      // Use selected algorith for generating the solution
      const algorithm = new algorithmClass(gridInfo, grid);

      // Generates a valid solution
      this.processGrid = await algorithm.generateSolution();

      // Hides cells based on dificulty
      await this.setDifficulty();

      this.hidokuGrid = this.processGrid;

      console.log('====================================');
      console.timeEnd('generateHidoku');
      console.log('====================================');

    } catch (error) {
      console.log('====================================');
      console.log('HP se rompio: ', error);
      console.log('====================================');
    } finally {
      this._loadingService.resolveAll('overlayStarSyntax');
    }
  }

  /**
   * Generates a grid with empty cells.
   *
   * @memberof AppComponent
   */
  generateGrid(gridInfo: GridInfo) {
    const processGrid: Cell[][] = [];
    for (let row = 0; row <= gridInfo.rows; row++) {
      processGrid[row] = [];
      for (let col = 0; col <= gridInfo.cols; col++) {
        processGrid[row][col] = new Cell(row, col);
      }
    }
    return processGrid;
  }

    /**
     * Backtracking part of the app, generates the
     * hidoku values for a valid solution.
     *
     * @memberof AppComponent
     */




  /**
   * Hides some cells based on the dificulty level.
   *
   * @memberof AppComponent
   */
  async setDifficulty() {

  }
}
