import * as fs from 'fs';
import * as _ from 'lodash';
import Record from './models/record';

export default class RecordManager {
  constructor() {
    this.records = [];
  }

  importFromFile(file) {
    return new Promise((resolve, reject) => {
      fs.readFile(file, { encoding: 'utf8' }, (err, data) => {
        if (err) reject(err);
        const recordSeeds = data.split('\n');
        this.import(recordSeeds);
        resolve();
      });
    });
  }

  import(data) {
    const recordsWithFields = this.prepareRecords(data)
    this.records = this.records.concat(recordsWithFields.map(record => new Record(record)));
  }

  prepareRecords(recordSeeds) {
    if (typeof recordSeeds === 'string') {
      recordSeeds = [recordSeeds];
    }

    const delimiter = this.detectDelimiter(recordSeeds[0]);
    const fields = ['lastName', 'firstName', 'gender', 'favoriteColor', 'dateOfBirth'];

    return recordSeeds.map(seed => {
      const splitFields = seed.split(delimiter);
      return _.zipObject(fields, splitFields);
    });
  }

  detectDelimiter(data) {
    const match = /[,|\|\s]/.exec(data);
    const delimiter = match[0];
    return delimiter;
  }
}
