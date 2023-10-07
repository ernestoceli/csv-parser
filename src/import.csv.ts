import { parse } from 'csv-parse/dist/cjs/sync.cjs';
import { Person, PersonRecord } from './types';
import moment = require('moment');
import { getDateFormat } from './getDateFormat';

const acceptedHeaders = ['firstname', 'lastname', 'birthday', 'job title'];

export const importCsv = (csv: string, csvDelimiter: string): Person[] => {
  if (csvDelimiter.length !== 1) {
    throw new Error('The delimiter must be a valid character');
  }
  const results = [];

  if (!getIsValidHeader(csv, csvDelimiter)) {
    throw new Error('The file did not match the expected format');
  }

  const records: PersonRecord[] = parse(csv, {
    delimiter: csvDelimiter,
    columns: true,
    trim: true,
  });

  const dateFormat = getDateFormat(records);

  for (const row of records) {
    const person = getPersonFromRow(row, dateFormat);

    results.push(person);
  }

  return results;
};

const getPersonFromRow = (
  row: PersonRecord,
  dateFormat: string | undefined,
): Person => {
  const birthday = moment(row.birthday, dateFormat).toDate();

  const person: Person = {
    firstname: row.firstname,
    lastname: row.lastname,
    birthday,
    jobTitle: row['job title'],
  };
  return person;
};

const getIsValidHeader = (csv: string, csvDelimiter: string): boolean => {
  const headers = csv
    .split('\n')[0]
    .split(csvDelimiter)
    .map(h => h.replace(/[\n\r]/g, ''));

  return acceptedHeaders.every(acceptedHeader =>
    headers.includes(acceptedHeader),
  );
};
