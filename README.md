# ali-opensearch-v3

#### Description

根据阿里云 Opensearch V3 的 API 开发的 nodejs SDK

#### Usage

`npm i ali-opensearch-v3`

```javascript
const { Client, QueryBuilder, Publisher } = require('ali-opensearch-v3');
// 新建一个Client：
const api = new Client('your host', 'appName', {
  accessKeyId,
  accessKeySecret
});

// 构建 query
const qb = QueryBuilder.create();

const queryString = qb
  .setQuery('your query string')
  .setFormat('json/fulljson/xml')
  .addFetchField('field you want to fetch')
  .setHit('hit number')
  // compile your query to percent encode string:
  .getQuery();

// 搜索
api.search('resource path', queryString); // promise

// 构建push的content:
const pub = Publisher.create('ADD/UPDATE/DELETE');
pub.addField('field key', 'field value');
// 将 pub 放入一个 array 中，然后用 Publisher的static方法生成bulk action:
const bulk = [];
bulk.push(pub);
bulk = Publisher.generateBatch(bulk);

// Publish：
api.publish('resource path', bulk); // promise
```

#### Testing

Please add a `test.config.json` file under `/test` directory directly for testing api in the follwing format:

```javascript
{
  "host": "<your host>",
  "accessKeyId": "<your accessKeyId>",
  "accessKeySecret": "<your accessKeySecret>",
  "appName": "<the appName you want to search for in your apps>",
  "query": "<The resource string of the searcch>",
  "publish": {
    "resource": "<resource path>", // /question/actions/bulk,
    "tableName": "<tableName>", // question
    "operations": [
      {
        "cmd": : "<ADD, UPDATE, DELETE>",
        "fields": [
          {
            "key": "<Your schema key>",
            "value": "<The value you want to post>"
          },
          ...
        ]
      }
    ]
  }
}
```

If it is not added, the test suit will skip it.

### License

[GPL v3 License](https://raw.githubusercontent.com/onlyjq04/ali-opensearch-v3/master/LICENSE)
