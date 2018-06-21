import Axios from 'axios';
import { Credential, GetReqHeader, PostReqHeader, Header } from './Header';

class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class Client {
  private static readonly _v: string = 'v3';
  private host: string;
  private credentials: Credential;
  constructor(host: string, cred: Credential) {
    this.credentials = cred;
    this.host = host;
  }

  public async search(appName: string, resourcePath: string, query: string): Promise<object> {
    const getReqHeader = new GetReqHeader(this.buildEntry(appName), resourcePath, query);
    const headers = {
      'Content-MD5': '',
      'Content-Type': getReqHeader.contentType,
      Authorization: this.buildAuthorization(getReqHeader),
      'X-Opensearch-Nonce': getReqHeader.canonicalizedOpenSearchHeaders,
      Date: getReqHeader.getDateString()
    };

    try {
      const resp = await Axios({
        method: GetReqHeader.verb,
        url: this.host + getReqHeader.canonicalizedResource,
        headers
      });
      if (resp.data.status === 'OK') {
        return resp.data;
      } else {
        throw new ApplicationError(
          'Search for resource failed:\n' +
            `Request headers: ${JSON.stringify(resp.config, null, 2)}\n` +
            `Response headers: ${JSON.stringify(resp.headers, null, 2)}\n` +
            `data: ${JSON.stringify(resp.data, null, 2)}`
        );
      }
    } catch (err) {
      throw err;
    }
  }

  public async publish(appName: string, resourcePath: string, content: object): Promise<object> {
    const postReqHeader = new PostReqHeader(this.buildEntry(appName), resourcePath, content);
    const headers = {
      Authorization: this.buildAuthorization(postReqHeader),
      'Content-Type': postReqHeader.contentType,
      Date: postReqHeader.getDateString(),
      'X-Opensearch-Nonce': postReqHeader.canonicalizedOpenSearchHeaders,
      'Content-MD5': postReqHeader.contentMD5
    };

    try {
      const resp = await Axios({
        method: PostReqHeader.verb,
        url: this.host + postReqHeader.canonicalizedResource,
        headers,
        data: postReqHeader.content
      });
      if (resp.data.status === 'OK') {
        return resp.data;
      } else {
        throw new ApplicationError(
          'Publish to resource failed:\n' +
            `Request headers: ${JSON.stringify(resp.config, null, 2)}\n` +
            `Response headers: ${JSON.stringify(resp.headers, null, 2)}\n` +
            `data: ${JSON.stringify(resp.data, null, 2)}`
        );
      }
    } catch (err) {
      throw err;
    }
  }

  public buildEntry(appName: string): string {
    return `/v3/openapi/apps/${appName}`;
  }

  public buildBaseUrl(appName: string) {
    return `${this.host}/v3/openapi/apps/${appName}`;
  }

  private buildAuthorization<T extends Header>(header: T): string {
    return `OPENSEARCH ${this.credentials.accessKeyId}:${header.buildSigniture(this.credentials)}`;
  }
}
