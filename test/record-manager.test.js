import { expect } from 'chai';

import Record from '../src/models/record';
import RecordManager from '../src/record-manager';

describe('RecordManager', () => {
  describe('#import', () => {
    let recordManager;

    beforeEach(() => recordManager = new RecordManager());

    it('imports a single, comma-delimited record', () => {
      const record = 'a,b,c,d,1/1/1111';
      recordManager.import(record);
      expect(recordManager.records).to.have.length(1);
    });

    it('imports a single, pipe-delimited record', () => {
      const record = 'a|b|c|d|1/1/1111';
      recordManager.import(record);
      expect(recordManager.records).to.have.length(1);
    });

    it('imports a single, space-delimited record', () => {
      const record = 'a b c d 1/1/1111';
      recordManager.import(record);
      expect(recordManager.records).to.have.length(1);
    });

    it('the imported record is a Record instance', () => {
      const record = 'a,b,c,d,1/1/1111';
      recordManager.import(record);
      const newRecord = recordManager.records[0];

      expect(newRecord).to.be.an.instanceOf(Record);
    });

    it('the imported record has the proper fields', () => {
      const record = 'a,b,c,d,1/1/1111';
      recordManager.import(record);
      const newRecord = recordManager.records[0];

      expect(newRecord.lastName).to.eq('a');
      expect(newRecord.firstName).to.eq('b');
      expect(newRecord.gender).to.eq('c');
      expect(newRecord.favoriteColor).to.eq('d');
      expect(newRecord.dateOfBirth.getTime()).to.eq(new Date('1111-01-01').getTime());
    });
  });
});
