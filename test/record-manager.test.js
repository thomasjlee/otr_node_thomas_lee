import * as path from 'path';
import { expect } from 'chai';
import Record from '../src/models/record';
import RecordManager from '../src/record-manager';

describe('RecordManager', () => {
  describe('#import', () => {
    describe('when importing a single record', () => {
      const commaDelimitedRecord = 'a,b,c,d,1/1/2000';
      const pipeDelimitedRecord = 'a|b|c|d|1/1/2000';
      const spaceDelimitedRecord = 'a b c d 1/1/2000';
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
        expect(dateOfBirth.getTime()).to.eq(new Date('2000-01-01').getTime());
      });
    });

    describe('when importing a multiple records', () => {
      let recordManager;
      beforeEach(() => recordManager = new RecordManager());

      it('imports an array of comma-delimited records', () => {
        const records = ['a,b,c,d,1/1/2000', 'e,f,g,h,1/1/2020'];
        recordManager.import(records);
        expect(recordManager.records).to.have.length(2);
      });

      it('imports an array of pipe-delimited records', () => {
        const records = ['a|b|c|d|1/1/2000', 'e|f|g|h|1/1/2020'];
        recordManager.import(records);
        expect(recordManager.records).to.have.length(2);
      });

      it('imports an array of space-delimited records', () => {
        const records = ['a b c d 1/1/2000', 'e f g h 1/1/2020'];
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
      const preparedRecords = recordManager.prepareRecords('a,b,c,d,1/1/2000');
      const expected = {
        lastName: 'a',
        firstName: 'b',
        gender: 'c',
        favoriteColor: 'd',
        dateOfBirth: '1/1/2000'
      };
      preparedRecords.forEach(prepared => {
        expect(prepared).to.include(expected)
      });
    });

    it('accepts multiple data', () => {
      const data = [
        'a,b,c,d,1/1/2000',
        'e,f,g,h,1/1/2020',
        'i,j,k,l,1,1,2040'
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

  describe('#sortedBy', () => {
    let recordManager;
    beforeEach(() => recordManager = new RecordManager());

    it('validates key arguments', () => {
      expect(() => recordManager.sortedBy('invalid')).to.throw(/Records may be sorted by/);
      expect(() => recordManager.sortedBy('gender', 'asc', 'invalid')).to.throw(/Records may be sorted by/);
    });

    it('validates order arguments', () => {
      expect(() => recordManager.sortedBy('gender', 'invalid')).to.throw(/Acceptable orders include/);
      expect(() => recordManager.sortedBy('gender', 'asc', 'lastName', 'invalid')).to.throw(/Acceptable orders include/);
    });

    it('sorts records by gender, ascending', () => {
      recordManager.import([
        '_,_,female,_,1/1/2000',
        '_,_,male,_,1/1/2000'
      ]);
      const sortedRecords = recordManager.sortedBy('gender');
      expect(sortedRecords[0].gender).to.eq('female');
      expect(sortedRecords[1].gender).to.eq('male');
    });

    it('sorts records by gender, descending', () => {
      recordManager.import([
        '_,_,female,_,1/1/2000',
        '_,_,male,_,1/1/2000'
      ]);
      const sortedRecords = recordManager.sortedBy('gender', 'desc');
      expect(sortedRecords[0].gender).to.eq('male');
      expect(sortedRecords[1].gender).to.eq('female');
    });

    it('sorts records by lastName, ascending', () => {
      recordManager.import([
        'a,_,_,_,1/1/2000',
        'z,_,_,_,1/1/2000'
      ]);
      const sortedRecords = recordManager.sortedBy('lastName');
      expect(sortedRecords[0].lastName).to.eq('a');
      expect(sortedRecords[1].lastName).to.eq('z');
    });

    it('sorts records by lastName, descending', () => {
      recordManager.import([
        'a,_,_,_,1/1/2000',
        'z,_,_,_,1/1/2000'
      ]);
      const sortedRecords = recordManager.sortedBy('lastName', 'desc');
      expect(sortedRecords[0].lastName).to.eq('z');
      expect(sortedRecords[1].lastName).to.eq('a');
    });

    it('sorts records by dateOfBirth, ascending', () => {
      recordManager.import([
        '_,_,_,_,1/1/2000',
        '_,_,_,_,1/1/2020'
      ]);
      const sortedRecords = recordManager.sortedBy('dateOfBirth');
      expect(sortedRecords[0].dateOfBirth.getTime()).to.eq(new Date('2000-01-01').getTime());
      expect(sortedRecords[1].dateOfBirth.getTime()).to.eq(new Date('2020-01-01').getTime());
    });

    it('sorts records by dateOfBirth, descending', () => {
      recordManager.import([
        '_,_,_,_,1/1/2000',
        '_,_,_,_,1/1/2020'
      ]);
      const sortedRecords = recordManager.sortedBy('dateOfBirth', 'desc');
      expect(sortedRecords[0].dateOfBirth.getTime()).to.eq(new Date('2020-01-01').getTime());
      expect(sortedRecords[1].dateOfBirth.getTime()).to.eq(new Date('2000-01-01').getTime());
    });

    describe('it can sort by multiple keys, in various orders', () => {
      it('sorts records by gender (asc), then lastName (asc)', () => {
        recordManager.import([
          'a,_,male,_,1/1/2000',
          'z,_,male,_,1/1/2020',
          'a,_,female,_,1/1/2000',
          'z,_,female,_,1/1/2020'
        ]);
        const sortedRecords = recordManager.sortedBy('gender', 'asc', 'lastName', 'asc');
        const [first, second, third, fourth] = sortedRecords;

        expect(first.gender).to.eq('female');
        expect(first.lastName).to.eq('a');

        expect(second.gender).to.eq('female');
        expect(second.lastName).to.eq('z');

        expect(third.gender).to.eq('male');
        expect(third.lastName).to.eq('a');

        expect(fourth.gender).to.eq('male');
        expect(fourth.lastName).to.eq('z');
      });

      it('sorts records by gender (asc), then lastName (desc)', () => {
        recordManager.import([
          'a,_,male,_,1/1/2000',
          'z,_,male,_,1/1/2020',
          'a,_,female,_,1/1/2000',
          'z,_,female,_,1/1/2020'
        ]);
        const sortedRecords = recordManager.sortedBy('gender', 'asc', 'lastName', 'desc');
        const [first, second, third, fourth] = sortedRecords;

        expect(first.gender).to.eq('female');
        expect(first.lastName).to.eq('z');

        expect(second.gender).to.eq('female');
        expect(second.lastName).to.eq('a');

        expect(third.gender).to.eq('male');
        expect(third.lastName).to.eq('z');

        expect(fourth.gender).to.eq('male');
        expect(fourth.lastName).to.eq('a');
      });

      it('sorts records by dateOfBirth (asc), then gender (desc)', () => {
        recordManager.import([
          'olderMale,_,male,_,1/1/2000',
          'olderFemale,_,female,_,1/1/2000',
          'youngerMale,_,male,_,1/1/2020',
          'youngerFemale,_,female,_,1/1/2020'
        ]);
        const sortedRecords = recordManager.sortedBy('dateOfBirth', 'asc', 'gender', 'desc');
        const [first, second, third, fourth] = sortedRecords;

        // older to younger, males before females
        expect(first.lastName).to.eq('olderMale');
        expect(second.lastName).to.eq('olderFemale');
        expect(third.lastName).to.eq('youngerMale');
        expect(fourth.lastName).to.eq('youngerFemale');
      });
    });

    describe('it ignores case when sorting by string fields', () => {
      it('by gender', () => {
        recordManager.import([
          '_,_,f,_,1/1/2000',
          '_,_,M,_,1/1/2000'
        ]);
        const sortedRecords = recordManager.sortedBy('gender');
        expect('f' > 'M').to.be.true
        expect(sortedRecords[0].gender).to.eq('f')
        expect(sortedRecords[1].gender).to.eq('M')
      });

      it('by lastName', () => {
        recordManager.import([
          'a,_,_,_,1/1/2000',
          'B,_,_,_,1/1/2000'
        ]);
        const sortedRecords = recordManager.sortedBy('lastName');
        expect('a' > 'B').to.be.true
        expect(sortedRecords[0].lastName).to.eq('a')
        expect(sortedRecords[1].lastName).to.eq('B')
      });
    });
  });
});
