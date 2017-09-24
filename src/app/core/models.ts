export class Cell {
  constructor(
    public value = 0,
    public label: number = null,
  ) {}

  showValue() {
    this.label = this.value;
  }

  hideValue() {
    this.label = null;
  }
}

export class GridInfo {
  filas: number;
  columnas: number;
  dificultad: number;

  constructor(value: GridInfo) {
    ({
      filas: this.filas,
      columnas: this.columnas,
      dificultad: this.dificultad
    } = value);
  }
}

export const formErrors = [
  {
    name: 'required',
    text: 'Este campo es requerido',
    rules: ['touched', 'dirty']
  },
  {
    name: 'min',
    text: 'Este campo debe ser mayor o igual a 1',
    rules: ['touched', 'dirty']
  },
  {
    name: 'max',
    text: 'Este campo debe ser menor o igual a 3',
    rules: ['touched', 'dirty']
  },
  {
    name: 'pattern',
    text: 'Este campo debe ser numerico',
    rules: ['touched', 'dirty']
  },
];
