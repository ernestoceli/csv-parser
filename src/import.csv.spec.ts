import * as fs from 'fs';
import { importCsv } from './import.csv';

const expectedData = [
  {
    firstname: 'sophia',
    lastname: 'copolla',
    birthday: new Date(1971, 4, 14),
    jobTitle: 'director',
  },
  {
    firstname: 'ada',
    lastname: 'loveLACE',
    birthday: new Date(1815, 11, 10),
    jobTitle: 'mathematician',
  },
  {
    firstname: 'Margaret',
    lastname: 'Hamilton',
    birthday: new Date(1936, 7, 17),
    jobTitle: 'programmer',
  },
  {
    firstname: 'Dorothy',
    lastname: 'Vaughan',
    birthday: new Date(1910, 8, 20),
    jobTitle: 'mathematician',
  },
];
describe('parseCsvData', () => {
  it('should import a csv file', () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/csv.1.txt')
      .toString();

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should import another csv file with a different date format', () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/csv.2.txt')
      .toString();

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should import a big file', () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/bigFile.txt')
      .toString();

    const records = importCsv(csvAsString, ',');

    const result = records.every(person => !!person.birthday);
    expect(result).toBeTruthy();
  });

  it('should support dash separated dates with format MM-DD-YYYY', async () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/datesWithMonthFirst.txt')
      .toString();

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should support dash separated dates with format DD-MM-YYYY', async () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/datesWithDayFirst.txt')
      .toString();

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should throw an error if the headers do not match the expected', async () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/badHeaders.txt')
      .toString();

    expect(() => importCsv(csvAsString, ',')).toThrowError(
      'The file did not match the expected format',
    );
  });

  it('should throw an error if the delimiter does not match the file', async () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/csv.1.txt')
      .toString();

    expect(() => importCsv(csvAsString, ':')).toThrowError(
      'The file did not match the expected format',
    );
  });

  it.each(['', '12', 'rt', '%^'])(
    'should throw an error if the delimiter is invalid',
    async delimiter => {
      const csvAsString = fs
        .readFileSync('src/__fixtures__/csv.1.txt')
        .toString();

      expect(() => importCsv(csvAsString, delimiter)).toThrowError(
        'The delimiter must be a valid character',
      );
    },
  );
});
