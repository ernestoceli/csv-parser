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
    const csvAsString = getCsvStringFromFileName('csv.1.txt');

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should import another csv file with a different date format', () => {
    const csvAsString = getCsvStringFromFileName('csv.2.txt');

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should import an empty csv file', () => {
    const result = importCsv('', ',');
    expect(result).toEqual([]);
  });

  it('should import a big file', () => {
    const csvAsString = getCsvStringFromFileName('bigFile.txt');

    const records = importCsv(csvAsString, ',');

    const result = records.every(person => !!person.birthday);
    expect(result).toBeTruthy();
  });

  it('should support dash separated dates with format MM-DD-YYYY', () => {
    const csvAsString = getCsvStringFromFileName('datesWithMonthFirst.txt');

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should support dash separated dates with format DD-MM-YYYY', () => {
    const csvAsString = getCsvStringFromFileName('datesWithDayFirst.txt');

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should import data with special characters', () => {
    const csvAsString = getCsvStringFromFileName('specialCharacters.txt');

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual([
      {
        firstname: 'Mary',
        lastname: "O'Reilly",
        birthday: new Date(2005, 2, 15),
        jobTitle: 'Tester',
      },
    ]);
  });

  it('should import data with empty fields', () => {
    const csvAsString = `firstname,lastname,birthday,job title\nsophia,,,director`;

    const result = importCsv(csvAsString, ',');

    expect(result[0].firstname).toBe('sophia');
    expect(result[0].lastname).toBe('');
    expect(isNaN(result[0].birthday.getTime())).toBe(true);
    expect(result[0].jobTitle).toBe('director');
  });

  it('should import a file with missing headers ignoring the first row', () => {
    const csvAsString = getCsvStringFromFileName('missingHeaders.txt');

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData.slice(1));
  });

  it('parse the data regardless of the names of the headers', () => {
    const csvAsString = getCsvStringFromFileName('badHeaders.txt');

    const result = importCsv(csvAsString, ',');
    expect(result).toEqual(expectedData);
  });

  it('should throw an error if the delimiter does not match the file', () => {
    const csvAsString = getCsvStringFromFileName('csv.1.txt');

    expect(() => importCsv(csvAsString, ':')).toThrow();
  });

  it('should throw an error for malformed data', () => {
    const csvAsString = getCsvStringFromFileName('malformed.txt');

    expect(() => importCsv(csvAsString, ',')).toThrow();
  });

  it.each([',', ';', ':', '\t', '|'])(
    'should support delimiter %s',
    delimiter => {
      const csvAsString = getCsvStringWithDelimiter(delimiter);

      const result = importCsv(csvAsString, delimiter);

      expect(result).toEqual([
        {
          firstname: 'first',
          lastname: 'second',
          birthday: new Date(1961, 5, 13),
          jobTitle: 'biologist',
        },
      ]);
    },
  );

  it.each(['', '12', 'rt', '%^'])(
    'should throw an error if the delimiter is invalid',
    delimiter => {
      const csvAsString = getCsvStringFromFileName('csv.1.txt');

      expect(() => importCsv(csvAsString, delimiter)).toThrowError(
        'The delimiter must be a valid character',
      );
    },
  );

  it('should assign an invalid date object to dates that cannot be parsed', () => {
    const csvAsString = getCsvStringFromFileName('inconsistentDates.txt');

    const logSpy = jest.spyOn(global.console, 'warn');

    const result = importCsv(csvAsString, ',');

    expect(logSpy).toHaveBeenCalledWith(
      'Unable to parse birthday for Dorothy Vaughan',
    );

    expect(isNaN(result[3].birthday.getTime())).toBe(true);

    logSpy.mockRestore();
  });
});

const getCsvStringFromFileName = (fileName: string) =>
  fs.readFileSync(`src/__fixtures__/${fileName}`).toString();

const getCsvStringWithDelimiter = (delimiter: string) =>
  `firstname${delimiter}lastname${delimiter}birthday${delimiter}job title
  first${delimiter}second${delimiter}06/13/1961${delimiter}biologist`;
