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
});
