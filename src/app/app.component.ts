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

  /**
   * Resolve by GreedyMatrix algorithm
   *
   * @memberof AppComponent
   */
  byGreedy() {
    this.generateHidoku(GreedyMatrix);
  }

  /**
   * Resolve by SpiralMatrix algorithm
   *
   * @memberof AppComponent
   */
  bySpiral() {
    this.generateHidoku(SpiralMatrix);
  }

  /**
   * Resolve by BackTracking algorithm
   *
   * @memberof AppComponent
   */
  byBackTracking() {
    this.generateHidoku(BackTracking);
  }

  /**
   * Generate hidoku board
   *
   * @param {typeof RecursiveAlgorightm} algorithmClass
   * @returns
   * @memberof AppComponent
   */
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
      rows: this.form.value.rows,
      cols: this.form.value.cols,
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
      await this.setDifficulty(gridInfo);

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
    for (let row = 0; row <= gridInfo.rowIndexes; row++) {
      processGrid[row] = [];
      for (let col = 0; col <= gridInfo.colIndexes; col++) {
        processGrid[row][col] = new Cell(row, col);
      }
    }
    return processGrid;
  }

  /**
   * Hides some cells based on the dificulty level.
   *
   * @param {GridInfo} gridInfo
   * @memberof AppComponent
   */
  async setDifficulty(gridInfo: GridInfo) {
    const dificultyPercentage = (70 - (gridInfo.dificulty * 10)) / 100;
    const toShow = Math.round(gridInfo.rows * gridInfo.cols * dificultyPercentage);

    for (let i = 0; i < toShow; i++) {
      const row = Math.round(Math.random() * gridInfo.rowIndexes);
      const col = Math.round(Math.random() * gridInfo.rowIndexes);

      this
        .processGrid[row][col]
        .showValue()
        .isClue = true;
    }
  }
}
