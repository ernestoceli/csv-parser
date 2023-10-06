import * as fs from 'fs';
import { importCsv } from './import.csv';

describe('parseCsvData', () => {
  it('should import a csv file', () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/csv.1.txt')
      .toString();

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual([
      {
        firstname: 'sophia',
        lastname: 'copolla',
        birthday: new Date(1971, 5, 14),
        jobTitle: 'director',
      },
      {
        firstname: 'ada',
        lastname: 'loveLACE',
        birthday: new Date(1815, 12, 10),
        jobTitle: 'mathematician',
      },
      {
        firstname: 'Margaret',
        lastname: 'Hamilton',
        birthday: new Date(1936, 8, 17),
        jobTitle: 'programmer',
      },
      {
        firstname: 'Dorothy',
        lastname: 'Vaughan',
        birthday: new Date(1910, 9, 20),
        jobTitle: 'mathematician',
      },
    ]);
  });

  it('should import another csv file with a different date format', () => {
    const csvAsString = fs
      .readFileSync('src/__fixtures__/csv.2.txt')
      .toString();

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual([
      {
        firstname: 'sophia',
        lastname: 'copolla',
        birthday: new Date(1971, 5, 14),
        jobTitle: 'director',
      },
      {
        firstname: 'ada',
        lastname: 'loveLACE',
        birthday: new Date(1815, 12, 10),
        jobTitle: 'mathematician',
      },
      {
        firstname: 'Margaret',
        lastname: 'Hamilton',
        birthday: new Date(1936, 8, 17),
        jobTitle: 'programmer',
      },
      {
        firstname: 'Dorothy',
        lastname: 'Vaughan',
        birthday: new Date(1910, 9, 20),
        jobTitle: 'mathematician',
      },
    ]);
  });
});
