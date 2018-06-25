export interface IQueryConfig {
  // 从搜索结果中第start个文档开始返回 范围[0, 5000] 默认0
  start?: number;
  // 返回文档的最大数量 范围 [0, 500] 默认10
  hit?: number;
  // 返回的文档格式，有xml、json、fulljson三种格式可选。fulljson：比json类型多输出一些节点，如variableValue等。
  format?: string;
  // 设置参与精排个数 范围[0, 2000]， 默认200
  rerank_size?: number;
}

export interface IQuery {
  body?: IQueryBody;
  fetch_fields?: string[];
  summary?: ISummary[];
}

// 搜索主体，需用&&连接
export interface IQueryBody {
  query?: string;
  config?: IQueryConfig;
  sort?: string;
}

export interface ISummary {
  // 要做摘要的字段
  summary_field: string;
  // 飘红标签，html标签去掉左右尖括号 default: em
  summary_element?: string;
  // 摘要的结尾省略符
  summary_ellipsis?: string;
  // 选取的摘要片段个数 default: 1
  summary_snipped?: number;
  // 摘要要展示的片段长度
  summary_len?: number;
  // 飘红的前缀，必须是完整的html标签，如<em>
  summary_element_prefix?: string;
  // 飘红的后缀，必须是完整的html标签，如</em>
  summary_element_postfix?: string;
}

export class QueryBuilder {
  private query: string;
  private payload: IQuery;

  protected constructor() {
    this.payload = {};
  }

  static create(): QueryBuilder {
    return new QueryBuilder();
  }

  public setQuery(txt: string): QueryBuilder {
    if (!this.payload.body) {
      this.payload.body = {};
    }
    this.payload.body.query = txt;
    return this;
  }

  public setFormat(format: string): QueryBuilder {
    if (!this.payload.body) {
      this.payload.body = {};
    }
    if (!this.payload.body.config) {
      this.payload.body.config = {};
    }
    this.payload.body.config.format = format;
    return this;
  }

  public setSort(sortString: string): QueryBuilder {
    if (!this.payload.body) {
      this.payload.body = {};
    }
    this.payload.body.sort = sortString;
    return this;
  }

  public setHit(hit: number): QueryBuilder {
    if (!this.payload.body) {
      this.payload.body = {};
    }
    if (!this.payload.body.config) {
      this.payload.body.config = {};
    }
    this.payload.body.config.hit = hit;
    return this;
  }

  public setStartHit(start: number): QueryBuilder {
    if (!this.payload.body) {
      this.payload.body = {};
    }
    if (!this.payload.body.config) {
      this.payload.body.config = {};
    }
    this.payload.body.config.start = start;
    return this;
  }

  public addFetchField(field: string): QueryBuilder {
    if (!this.payload.fetch_fields) {
      this.payload.fetch_fields = [];
    }
    this.payload.fetch_fields.push(field);
    return this;
  }

  public addSummary(
    summary_field: string,
    summary_element?: string,
    summary_ellipsis?: string,
    summary_snipped?: number,
    summary_len?: number,
    summary_element_prefix?: string,
    summary_element_postfix?: string
  ): QueryBuilder {
    const summary = {} as ISummary;

    if (!summary_field) {
      throw new Error('Summary must contains summary_field field');
    }

    summary['summary_field'] = summary_field;
    if (summary_element) summary['summary_element'] = summary_element;
    if (summary_element) summary['summary_ellipsis'] = summary_ellipsis;
    if (summary_element) summary['summary_snipped'] = summary_snipped;
    if (summary_element) summary['summary_len'] = summary_len;
    if (summary_element) summary['summary_element_prefix'] = summary_element_prefix;
    if (summary_element) summary['summary_element_postfix'] = summary_element_postfix;

    if (!this.payload.summary) {
      this.payload.summary = [];
    }

    this.payload.summary.push(summary);

    return this;
  }

  public getQuery(): string {
    this.query = this.buildQueryString();
    return this.query;
  }

  private parseObj(obj: object): string {
    return Object.keys(obj).reduce((ret, cur, idx, self) => {
      ret = ret + cur + ':' + obj[cur];
      if (idx < self.length - 1) {
        ret = ret + ',';
      }
      return ret;
    }, '');
  }

  private sortParams(params: object): any {
    return Object.keys(params)
      .map(k => {
        return { key: k, value: params[k] };
      })
      .sort((a, b) => {
        const aStr = a.key + '=' + a.value;
        const bStr = b.key + '=' + b.value;

        if (aStr < bStr) {
          return -1;
        }
        if (aStr > bStr) {
          return 1;
        }
        return 0;
      });
  }

  private encoder(str: string): string {
    return encodeURIComponent(str).replace(/'/g, '%27');
  }

  private buildQueryString(): string {
    const { summary, fetch_fields } = this.payload;
    const paramsMap = {};

    // This part is fully percent encoded
    if (this.payload.body) {
      const { config, query, sort } = this.payload.body;
      if (!query) {
        throw new Error('Query string must be provided');
      }

      let temp = `query=${query}`;

      if (config) {
        temp = temp + '&&config=' + this.parseObj(config);
      }

      if (sort) {
        temp = temp + '&&sort=' + sort;
      }

      paramsMap['query'] = temp;
    }

    // This part is only percent encoded the portion after the eq sign
    if (fetch_fields) {
      paramsMap['fetch_fields'] = fetch_fields.join(';');
    }
    if (summary && summary.length > 0) {
      const summaryParsed = [];
      summary.forEach(s => {
        summaryParsed.push(this.parseObj(s));
      });
      paramsMap['summary'] = summaryParsed.join(';');
    }

    const paramsArr = this.sortParams(paramsMap);

    const finalString = paramsArr
      .map(o => {
        return o.key + '=' + this.encoder(o.value);
      })
      .join('&');

    return 'search?' + finalString;
  }
}
