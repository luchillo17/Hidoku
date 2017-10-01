interface IGridInfo {
  rows: number;
  cols: number;
  quantity?: number;
  dificulty: number;
  readonly rowIndexes?: number;
  readonly colIndexes?: number;
}

export class GridInfo implements IGridInfo {
  rows: number;
  cols: number;
  quantity?: number;
  dificulty: number;

  constructor(value: IGridInfo) {
    ({
      rows: this.rows,
      cols: this.cols,
      dificulty: this.dificulty
    } = value);
    this.quantity = (this.rows) * (this.cols);
  }
  get rowIndexes() {
    return this.rows - 1;
  }
  get colIndexes() {
    return this.cols - 1;
  }
}

export class Move {
  constructor(public row: number, public col: number) {}
}

export class Cell {

  isEdge = false;
  readOnly = false;
  isShowValue = false;

  constructor(
    public row = 0,
    public col = 0,
    public value = 0,
  ) {}

  get label() {
    if (!this.isShowValue) {
      return null;
    }
    return this.value;
  }

  get isClue() {
    return this.readOnly;
  }

  set isClue(isClue: boolean) {
    this.readOnly = isClue;
  }

  showValue() {
    this.isShowValue = true;
    return this;
  }

  hideValue() {
    this.isShowValue = true;
    return this;
  }

  setValue(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.valueAsNumber;
    return this;
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
