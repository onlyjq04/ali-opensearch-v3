export declare interface Credential {
  accessKeyId: string;
  accessKeySecret: string;
}

export declare interface IQueryConfig {
  // 从搜索结果中第start个文档开始返回 范围[0, 5000] 默认0
  start?: number;
  // 返回文档的最大数量 范围 [0, 500] 默认10
  hit?: number;
  // 返回的文档格式，有xml、json、fulljson三种格式可选。fulljson：比json类型多输出一些节点，如variableValue等。
  format?: string;
  // 设置参与精排个数 范围[0, 2000]， 默认200
  rerank_size?: number;
}

export declare interface IQueryBody {
  query?: string;
  config?: IQueryConfig;
  sort?: string;
}

export declare interface IQuery {
  body?: IQueryBody;
  fetch_fields?: string[];
  summary?: ISummary;
}
export declare interface ISummary {
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

export declare enum OPER_TYPES {
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
}

export declare class Client {
  constructor(host: string, appName: string, cred: Credential);
  search(resourcePath: string, query: string): Promise<object>;
  publish(resourcePath: string, content: object): Promise<object>;
}

export declare class Publisher {
  static create(oper: OPER_TYPES): Publisher;
  static generateBatch(publishers: Publisher[], standard?: boolean): object;
  addField(key: string, value: any): Publisher;
}

export declare class QueryBuilder {
  static create(): QueryBuilder;
  setQuery(txt: string): QueryBuilder;
  setFormat(format: string): QueryBuilder;
  setSort(sortString: string): QueryBuilder;
  setHit(hit: number): QueryBuilder;
  setStartHit(start: number): QueryBuilder;
  addFetchField(field: string): QueryBuilder;
  addSummary(summary: ISummary): QueryBuilder;
  getQuery(): string;
}
