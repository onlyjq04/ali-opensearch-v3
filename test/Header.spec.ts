import * as Header from '../src/lib/Header';
import { expect } from 'chai';

describe('Header tests', () => {
  const entry = '/v3/openapi/apps/app_schema_demo';
  const query =
    'search?fetch_fields=name&query=config%3Dformat%3Afulljson&&query%3Dname%3A%27%E6%96%87%E6%A1%A3%27&&sort%3Did';
  const cred = {
    accessKeyId: '',
    accessKeySecret: '5OCGljiVeXLvO49QaEYuYQjUb1HAZQ'
  };
  describe('Get header', () => {
    it('should return the right auth header', done => {
      const getReqHeader = new Header.GetReqHeader(entry, '', query);

      getReqHeader.canonicalizedOpenSearchHeaders = '150224365226248';
      getReqHeader.date = new Date('2017-08-09T01:54:12Z');

      expect(getReqHeader.buildSigniture(cred)).to.equal('EG+VyxqNhSsPgdaFYfl5Wd7Pulo=');
      done();
    });
  });
});
