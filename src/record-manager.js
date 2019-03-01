import * as _ from 'lodash';

import Record from './models/record';
import ImportHelper from './helpers/import-helper';

export default class RecordManager {
  constructor() {
    this.records = [];
  }

  import(data) {
    const recordFields = this.prepareRecord(data)
    this.records.push(new Record(recordFields));
  }

  prepareRecord(data) {
    const splitData = ImportHelper.parse(data);
    const fields = ['lastName', 'firstName', 'gender', 'favoriteColor', 'dateOfBirth'];
    const recordFields = _.zipObject(fields, splitData);
    return recordFields;
  }
}
