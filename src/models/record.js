export default class Record {
  constructor({lastName, firstName, gender, favoriteColor, dateOfBirth}) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.gender = gender;
    this.favoriteColor = favoriteColor;
    this.dateOfBirth = this.setDate(dateOfBirth);
  }

  setDate(date) {
    const [day, month, year] = date.split('/');
    return new Date([year, month.padStart(2, 0), day.padStart(2, 0)].join('-'));
  }
}
