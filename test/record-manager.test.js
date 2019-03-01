import { expect } from 'chai';

import Record from '../src/models/record';
import RecordManager from '../src/record-manager';

describe('RecordManager', () => {
  describe('#import', () => {
    it('imports a single, comma-delimited record', () => {
      const recordManager = new RecordManager();
      const record = 'a,b,c,d,1/1/1111';
      recordManager.import(record);
      expect(recordManager.records).to.have.length(1);
      expect(recordManager.records[0]).to.be.an.instanceOf(Record);
    });
  });
});
