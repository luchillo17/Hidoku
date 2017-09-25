export class GridInfo {
  rows: number;
  cols: number;
  quantity?: number;
  dificulty: number;

  constructor(value: GridInfo) {
    ({
      rows: this.rows,
      cols: this.cols,
      dificulty: this.dificulty
    } = value);
    this.quantity = (this.rows + 1) * (this.cols + 1);
  }
}

export class Move {
  constructor(public row, public col) {}
}

export class Cell {

  isEdge = false;

  constructor(
    public row = 0,
    public col = 0,
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
