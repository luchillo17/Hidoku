import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Cell, formErrors, GridInfo } from './core/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  hidokuGrid = [];
  form: FormGroup;
  errors = formErrors;

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      filas: [null, [
        Validators.required,
        Validators.pattern(/\d+/),
        Validators.min(1),
      ]],
      columnas: [null, [
        Validators.required,
        Validators.pattern(/\d+/),
        Validators.min(1),
      ]],
      dificultad: [2, [
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

    const gridInfo = new GridInfo(this.form.value);

    // Generates a matrix
    this.generateGrid(gridInfo);

    // Generates a valid solution
    this.generateSolution(gridInfo);

    // Hides cells based on dificulty
    this.setDifficulty(gridInfo);
  }

  generateGrid(gridInfo: GridInfo) {
    for (let fila = 0; fila < gridInfo.filas; fila++) {
      this.hidokuGrid[fila] = [];
      for (let columna = 0; columna < gridInfo.columnas; columna++) {
        this.hidokuGrid[fila][columna] = new Cell();
      }
    }
  }

  generateSolution(gridInfo: GridInfo) {

  }

  setDifficulty(gridInfo: GridInfo) {

  }
}
