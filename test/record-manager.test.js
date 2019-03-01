import * as path from 'path';
import { expect } from 'chai';
import Record from '../src/models/record';
import RecordManager from '../src/record-manager';

describe('RecordManager', () => {
  describe('#import', () => {
    describe('when importing a single record', () => {
      const commaDelimitedRecord = 'a,b,c,d,1/1/1111';
      const pipeDelimitedRecord = 'a|b|c|d|1/1/1111';
      const spaceDelimitedRecord = 'a b c d 1/1/1111';
      let recordManager;

      beforeEach(() => recordManager = new RecordManager());

      it('imports a single, comma-delimited record', () => {
        recordManager.import(commaDelimitedRecord);
        expect(recordManager.records).to.have.length(1);
      });

      it('imports a single, pipe-delimited record', () => {
        recordManager.import(pipeDelimitedRecord);
        expect(recordManager.records).to.have.length(1);
      });

      it('imports a single, space-delimited record', () => {
        recordManager.import(spaceDelimitedRecord);
        expect(recordManager.records).to.have.length(1);
      });

      it('the imported record is a Record instance', () => {
        recordManager.import(commaDelimitedRecord);
        const newRecord = recordManager.records[0];
        expect(newRecord).to.be.an.instanceOf(Record);
      });

      it('the imported record has the proper fields', () => {
        recordManager.import(commaDelimitedRecord);
        const newRecord = recordManager.records[0];
        const expectedFields = {
          lastName: 'a',
          firstName: 'b',
          gender: 'c',
          favoriteColor: 'd'
        };
        const { lastName, firstName, gender, favoriteColor, dateOfBirth } = newRecord;
        expect({ lastName, firstName, gender, favoriteColor }).to.include(expectedFields);
        expect(dateOfBirth.getTime()).to.eq(new Date('1111-01-01').getTime());
      });
    });

    describe('when importing a multiple records', () => {
      let recordManager;
      beforeEach(() => recordManager = new RecordManager());

      it('imports an array of comma-delimited records', () => {
        const records = ['a,b,c,d,1/1/1111', 'e,f,g,h,2/2/2222'];
        recordManager.import(records);
        expect(recordManager.records).to.have.length(2);
      });

      it('imports an array of pipe-delimited records', () => {
        const records = ['a|b|c|d|1/1/1111', 'e|f|g|h|2/2/2222'];
        recordManager.import(records);
        expect(recordManager.records).to.have.length(2);
      });

      it('imports an array of space-delimited records', () => {
        const records = ['a b c d 1/1/1111', 'e f g h 2/2/2222'];
        recordManager.import(records);
        expect(recordManager.records).to.have.length(2);
      });
    });
  });

  describe('#importFromFile', () => {
    const resolveFixturesPath = (file) => path.join(__dirname, '..', 'test', 'fixtures', file);
    const commaDelimitedFile = resolveFixturesPath('comma-delimited.csv');
    const pipeDelimitedFile = resolveFixturesPath('pipe-delimited.txt');
    const spaceDelimitedFile = resolveFixturesPath('space-delimited.txt');
    let recordManager;

    beforeEach(() => recordManager = new RecordManager());

    it('imports a file with comma-delimited records', async () => {
      await recordManager.importFromFile(commaDelimitedFile);
      expect(recordManager.records).to.have.length(2);
    });

    it('imports a file with pipe-delimited records', async () => {
      await recordManager.importFromFile(pipeDelimitedFile);
      expect(recordManager.records).to.have.length(2);
    });

    it('imports a file with space-delimited records', async () => {
      await recordManager.importFromFile(spaceDelimitedFile);
      expect(recordManager.records).to.have.length(2);
    });

    it('imports multiple files', async () => {
      await recordManager.importFromFile(commaDelimitedFile);
      await recordManager.importFromFile(pipeDelimitedFile);
      await recordManager.importFromFile(spaceDelimitedFile);
      expect(recordManager.records).to.have.length(6);
    });
  });

  describe('#prepareRecords', () => {
    let recordManager;
    beforeEach(() => recordManager = new RecordManager());

    it('returns an array of objects prepared for the Record constructor', () => {
      const preparedRecords = recordManager.prepareRecords('a,b,c,d,1/1/1111');
      const expected = {
        lastName: 'a',
        firstName: 'b',
        gender: 'c',
        favoriteColor: 'd',
        dateOfBirth: '1/1/1111'
      };
      preparedRecords.forEach(prepared => {
        expect(prepared).to.include(expected)
      });
    });

    it('accepts multiple data', () => {
      const data = [
        'a,b,c,d,1/1/1111',
        'e,f,g,h,2/2/2222',
        'i,j,k,l,3,3,3333'
      ];
      const preparedRecords = recordManager.prepareRecords(data);
      expect(preparedRecords).to.have.length(3);
      preparedRecords.forEach(prepared => {
        expect(prepared).to.have.property('lastName');
        expect(prepared).to.have.property('firstName');
        expect(prepared).to.have.property('gender');
        expect(prepared).to.have.property('favoriteColor');
        expect(prepared).to.have.property('dateOfBirth');
      });
    });
  });

  describe('#detectDelimiter', () => {
    it('detects commas', () => {
      expect((new RecordManager).detectDelimiter('a,b,c')).to.eq(',');
    });

    it('detects pipes', () => {
      expect((new RecordManager).detectDelimiter('a|b|c')).to.eq('|');
    });

    it('detects spaces', () => {
      expect((new RecordManager).detectDelimiter('a b c')).to.eq(' ');
    });
  });
});
