import Record from './models/record';

export default class RecordManager {
  constructor() {
    this.records = [];
  }

  import(record) {
    this.records.push(new Record(record));
  }
}
