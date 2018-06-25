import { Client } from '../src/lib/Client';
import { QueryBuilder } from '../src/lib/QueryBuilder';
import { Publisher } from '../src/lib/Publisher';
import { expect } from 'chai';
import * as minimist from 'minimist';

describe('OSApi Tests', () => {
  this.timeout = 10000;

  let config;
  let cred;
  let host;
  let query;
  let appName;
  let api;
  let run;

  before('Check the preconditions', () => {
    function conditionToRun() {
      const configJSON = minimist(process.argv).config;

      try {
        config = require(configJSON);
      } catch (err) {
        console.error(err);
        return false;
      }

      if (!config) {
        console.log('No configurations provided, skipped');
        return false;
      } else {
        cred = {
          accessKeyId: config.accessKeyId,
          accessKeySecret: config.accessKeySecret
        };
        appName = config.appName;
        host = config.host;
        api = new Client(host, appName, cred);
        query = QueryBuilder.create();
        query.setQuery(config.query).setFormat('fulljson');

        return true;
      }
    }
    run = conditionToRun();
  });

  it('should make the search request to ali-opensearch', async () => {
    if (run) {
      try {
        const result = await api.search('', query.getQuery());
        expect(result.result.items).to.be.exist;
      } catch (err) {
        console.log(err);
      }
    }
  });
  it('should make the post request to ali-opensearch', async () => {
    if (run) {
      const batch = [];
      config.publish.operations.forEach(op => {
        const pub = Publisher.create(op.cmd);
        op.fields.forEach(f => {
          pub.addField(f.key, f.value);
        });
        batch.push(pub);
      });
      try {
        const result = await api.publish(config.publish.resource, Publisher.generateBatch(batch));
        expect(result);
      } catch (err) {
        console.log(err.response.data.errors);
      }
    }
  });
});
