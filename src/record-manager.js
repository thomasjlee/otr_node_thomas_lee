import * as fs from 'fs';
import * as _ from 'lodash';
import Record from './record';

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

  sortedBy(...keysOrders) {
    const keys = [];
    const orders = [];
    keysOrders.forEach((el, idx) => {
      if (idx % 2 === 0) {
        keys.push(el);
      } else {
        orders.push(el);
      }
    });

    this.validateSortedByArguments(keys, orders);

    // normalize case of lastNames and genders
    const iteratees = keys.map(key => {
      return record => {
        if (typeof record[key] === 'string') {
          return record[key].toLowerCase();
        }
        return record[key];
      }
    });

    return _.orderBy(this.records, iteratees, orders);
  }

  validateSortedByArguments(keys, orders) {
    const acceptableKeys = ['gender', 'lastName', 'dateOfBirth'];
    const acceptableOrders = ['asc', 'desc'];
    const invalidKeyErr = new Error(`Records may be sorted by [${acceptableKeys.join(', ')}]`);
    const invalidOrderErr = new Error(`Acceptable orders include [${acceptableOrders.join(', ')}]`);

    keys.forEach(key => {
      if (!acceptableKeys.includes(key)) throw invalidKeyErr;
    });

    orders.forEach(order => {
      if (!acceptableOrders.includes(order)) throw invalidOrderErr;
    });
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
