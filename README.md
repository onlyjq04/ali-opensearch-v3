# ali-opensearch-v3

#### Description

根据阿里云 Opensearch V3 的 API 开发的 nodejs SDK

### Testing

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

[GPL v3 License](https://raw.githubusercontent.com/leftstick/string-transformer/master/LICENSE)
