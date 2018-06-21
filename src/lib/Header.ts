import { VERB } from '../enum';
import { createHash, createHmac } from 'crypto';
import { join } from 'path';

export interface Credential {
  accessKeyId: string;
  accessKeySecret: string;
}

export abstract class Header {
  public readonly version: string = 'v3';
  public contentType: string = 'application/json';
  public canonicalizedResource: string;
  public canonicalizedOpenSearchHeaders: string;
  public date: Date;

  /**
   *
   * @param entryUrl
   * @param resource
   * @param query
   */
  constructor(entryUrl: string, resource: string, query?: string) {
    this.date = new Date();
    this.canonicalizedResource = join(entryUrl, resource || '', query || '');
    this.canonicalizedOpenSearchHeaders = this.generateNonce();
  }

  public getDateString(): string {
    return this.date.toISOString().split('.')[0] + 'Z';
  }

  private generateNonce(): string {
    return Math.floor(this.date.getTime() / 1000).toString() + Math.round(Math.random() * 89999 + 10000).toString();
  }

  abstract buildSigniture(cred: Credential): string;
}

export class GetReqHeader extends Header {
  public static readonly verb = VERB.GET;

  constructor(entryUrl: string, resource: string, query: string) {
    super(entryUrl, resource, query);
  }
  public buildSigniture(cred: Credential) {
    const { accessKeySecret } = cred;
    const { canonicalizedOpenSearchHeaders, canonicalizedResource, contentType } = this;
    const sigString = [
      GetReqHeader.verb,
      '', // content-md5 is empty here
      contentType,
      this.getDateString(),
      `x-opensearch-nonce:${canonicalizedOpenSearchHeaders}`,
      canonicalizedResource
    ].join('\n');

    const sigHmac = createHmac('sha1', Buffer.from(accessKeySecret).toString('utf-8'));
    sigHmac.update(Buffer.from(sigString).toString('utf-8'));
    return sigHmac.digest('base64');
  }
}

export class PostReqHeader extends Header {
  public static readonly verb = VERB.POST;
  public readonly content: object;
  public readonly contentMD5: string;

  constructor(entryUrl: string, resource: string, content: object) {
    super(entryUrl, resource);
    this.content = JSON.parse(Buffer.from(JSON.stringify(content)).toString('utf-8'));
    this.contentMD5 = this.generateMd5(JSON.stringify(this.content));
  }

  public buildSigniture(cred: Credential) {
    const { accessKeySecret } = cred;
    const { contentMD5, canonicalizedResource, contentType, canonicalizedOpenSearchHeaders } = this;

    const sigString = [
      PostReqHeader.verb,
      contentMD5,
      contentType,
      this.getDateString(),
      `x-opensearch-nonce:${canonicalizedOpenSearchHeaders}`,
      canonicalizedResource
    ].join('\n');

    const sigHmac = createHmac('sha1', Buffer.from(accessKeySecret).toString('utf-8'));
    sigHmac.update(Buffer.from(sigString).toString('utf-8'));
    return sigHmac.digest('base64');
  }

  private generateMd5(content: string): string {
    const md5 = createHash('md5');
    return md5.update(content).digest('hex');
  }
}
