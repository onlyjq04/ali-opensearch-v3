import { OPER_TYPES } from '../enum';
interface ICommand {
  cmd: OPER_TYPES;
  fields: object;
}
export class Publisher {
  private _fields: object;
  private _oper: OPER_TYPES;

  protected constructor() {}

  public static create(oper: OPER_TYPES): Publisher {
    const pb = new Publisher();
    return pb.setOper(oper).initFields();
  }

  public static generateBatch(publishers: Publisher[], standard?: boolean): object[] {
    return publishers.map(p => {
      return p.compile(standard);
    });
  }

  get oper(): string {
    return this._oper;
  }

  public addField(key: string, value: any): Publisher {
    this._fields[key] = value;
    return this;
  }

  private setOper(oper: OPER_TYPES): Publisher {
    this._oper = oper;
    return this;
  }

  private compile(standard?: Boolean): object {
    const ret = { cmd: this.oper, fields: this._fields };
    if (!standard) {
      ret['timestamp'] = new Date().getTime();
    }
    return ret;
  }

  private initFields(): Publisher {
    this._fields = {};
    return this;
  }
}
