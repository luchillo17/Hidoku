import {TdLoadingService} from '@covalent/core';
import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { flatMap } from 'lodash';
import domtoimage from 'dom-to-image';

import { Cell, formErrors, GridInfo, Move } from './core/models';
import { BackTracking, RecursiveAlgorightm, SpiralMatrix, GreedyMatrix } from './core/algorithms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @ViewChild('formData')
  formRef: NgForm;

  @ViewChild('hidokuTable')
  tableRef: ElementRef;

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

    performance.clearMeasures();
    performance.mark('A');

    const gridInfo = new GridInfo({
      rows: this.form.value.rows,
      cols: this.form.value.cols,
      dificulty: this.form.value.dificulty,
    });

    try {

      // Generates a matrix
      let grid = this.generateGrid(gridInfo);

      // Use selected algorith for generating the solution
      const algorithm = new algorithmClass(gridInfo, grid);

      // Generates a valid solution
      grid = await algorithm.generateSolution();

      // Hides cells based on dificulty
      await this.setDifficulty(grid, gridInfo);

      this.gridInfo = gridInfo;
      this.hidokuGrid = grid;

      performance.mark('B');
      performance.measure('A-B', 'A', 'B');
      console.log('====================================');
      console.log(performance.getEntriesByName('A-B')[0]);
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
  async setDifficulty(grid: Cell[][], gridInfo: GridInfo) {
    const dificultyPercentage = (70 - (gridInfo.dificulty * 10)) / 100;
    const toShow = Math.round(gridInfo.rows * gridInfo.cols * dificultyPercentage);
    gridInfo.clues = toShow;
    for (let i = 0; i < toShow; i++) {
      const row = Math.round(Math.random() * gridInfo.rowIndexes);
      const col = Math.round(Math.random() * gridInfo.rowIndexes);

      grid[row][col]
        .showValue()
        .isClue = true;
    }
  }

  saveTxt() {
    const matrixCells: Cell[] = flatMap(this.hidokuGrid, (row) => row.filter((cell) => cell.isShowValue));

    const textLines = [
      `${this.gridInfo.rows} ${this.gridInfo.cols} ${this.gridInfo.dificulty} ${this.gridInfo.clues}`,
      ...matrixCells.map(cell => `${cell.row} ${cell.col} ${cell.value}`),
      `${(performance.getEntriesByName('A-B')[0].duration / 1000).toFixed(4)}`,
    ].join('\n');

    // tslint:disable-next-line:quotemark
    const text = `data: text/plain; charset=utf-8,${encodeURI(textLines)}`;

    const link = document.createElement('a');
    link.setAttribute('href', text);
    link.setAttribute('download', `hidoku.txt`);
    link.click();
  }

  async savePng() {
    const hidoku: HTMLTableElement = this.tableRef.nativeElement;
    const text = await domtoimage.toPng(hidoku);

    const link = document.createElement('a');
    link.setAttribute('href', text);
    link.setAttribute('download', `hidoku.png`);
    link.click();
  }
}
