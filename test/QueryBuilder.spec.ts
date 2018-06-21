import { expect } from 'chai';
import { QueryBuilder } from '../src/lib/QueryBuilder';

describe('Test query builder', () => {
  it('Tests query from the ali doc', done => {
    const query = QueryBuilder.create()
      .setQuery(`name:'文档'`)
      .setSort('id')
      .setFormat('fulljson')
      .addFetchField('name')
      .getQuery();
    expect(query).to.be.eq(
      `search?fetch_fields=name&query=query%3Dname%3A%27%E6%96%87%E6%A1%A3%27%26%26config%3Dformat%3Afulljson%26%26sort%3Did`
    );
    done();
  });
  it('Tests empty query', done => {
    const query = QueryBuilder.create().setQuery('');
    try {
      query.getQuery();
    } catch (err) {
      expect(err);
    }
    done();
  });
});
