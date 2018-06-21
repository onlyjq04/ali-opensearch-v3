import { Publisher } from '../src/lib/Publisher';
import { OPER_TYPES } from '../src/enum';
import { expect } from 'chai';

describe('Test Publisher', () => {
  it('should build the right publish content body', done => {
    const questionPublisher = Publisher.create(OPER_TYPES.ADD);
    const pub = questionPublisher.addField('objectId', '1234567888');
    expect(Publisher.generateBatch([pub], true)).to.eql([{ cmd: 'ADD', fields: { objectId: '1234567888' } }]);
    done();
  });
});
