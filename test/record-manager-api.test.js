import { expect } from 'chai';
import request from 'supertest';
import RecordManagerAPI from '../task-two';
import RecordManager from '../src/record-manager';

describe('API', () => {
  let recordManager;
  let recordManagerAPI;
  let server;

  beforeEach(() => {
    recordManager = new RecordManager();
    recordManagerAPI = new RecordManagerAPI(recordManager);
    server = recordManagerAPI.app.listen(3001);
  });

  afterEach(async () => await server.close());

  describe('GET /records/gender', async () => {
    it('responds with records sorted by gender', async () => {
      const male = '_,_,male,_,1/1/2000';
      const female = '_,_,female,_,1/1/2000';
      recordManagerAPI.store.recordManager.import([male, female])

      const response = await request(server).get('/records/gender');
      const { records } = response.body.data;

      expect(records[0].gender).to.eq('female');
      expect(records[1].gender).to.eq('male');
    });
  });

  describe('GET /records/birthdate', async () => {
    it('responds with records sorted by dateOfBirth', async () => {
      const older = '_,_,_,_,1/1/1990';
      const younger = '_,_,_,_,1/1/2010';
      recordManagerAPI.store.recordManager.import([younger, older]);

      const response = await request(server).get('/records/birthdate');
      const { records } = response.body.data;

      const fullYearFrom = record => {
        return (new Date(record.dateOfBirth)).getUTCFullYear()
      };

      expect(fullYearFrom(records[0])).to.eq(1990);
      expect(fullYearFrom(records[1])).to.eq(2010);
    });
  });

  describe('GET /records/name', async () => {
    it('responds with records sorted by name', async () => {
      const aLastName = 'a,_,_,_,1/1/2000';
      const zLastName = 'z,_,_,_,1/1/2000';
      recordManagerAPI.store.recordManager.import([zLastName, aLastName]);

      const response = await request(server).get('/records/name');
      const { records } = response.body.data;

      expect(records[0].lastName).to.eq('a');
      expect(records[1].lastName).to.eq('z');
    });
  });

  describe('POST /records', async () => {
    it('adds a single record and responds with the new record', async () => {
      const response = await request(server)
        .post('/records')
        .send({ records: 'last,first,male,blue,1/1/2000' });

      const { records } = response.body.data;
      expect(records).to.have.lengthOf(1);

      const persistedRecords = recordManagerAPI.store.recordManager.records;
      expect(persistedRecords).to.have.lengthOf(1);
      expect(persistedRecords[0].lastName).to.eq('last');
    });

    it('adds multiple records and responds with the new records', async () => {
      const response = await request(server)
        .post('/records')
        .send({
            records: [
            'one,first,male,blue,1/1/2000',
            'two,first,male,blue,1/1/2000',
            'three,first,male,blue,1/1/2000',
          ]
        });

      const { records } = response.body.data;
      expect(records).to.have.lengthOf(3);

      const persistedRecords = recordManagerAPI.store.recordManager.records;
      expect(persistedRecords).to.have.lengthOf(3);
    });

    it('responds with records that have been added with multiple POSTs', async () => {
      await request(server)
        .post('/records')
        .send({ records: 'one,first,male,blue,1/1/2000' });

      await request(server)
        .post('/records')
        .send({ records: 'two,first,male,blue,1/1/2000' });

      const response = await request(server)
        .post('/records')
        .send({ records: 'three,first,male,blue,1/1/2000' });

      const { records } = response.body.data;
      expect(records).to.have.lengthOf(3);

      const persistedRecords = recordManagerAPI.store.recordManager.records;
      expect(persistedRecords).to.have.lengthOf(3);
    });
  });
});
