export default class ImportHelper {
  static detectDelimiter(data) {
    const match = /[,|\|\s]/.exec(data);
    const delimiter = match[0];
    return delimiter;
  }

  static parse(data) {
    const delimiter = this.detectDelimiter(data);
    return data.split(delimiter);
  }
}
