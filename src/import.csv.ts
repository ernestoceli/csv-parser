import { parse } from 'csv-parse/dist/cjs/sync.cjs';
import { Person } from './types';
import moment = require('moment');
import { getDateFormat } from './getDateFormat';

const acceptedHeaders = ['firstname', 'lastname', 'birthday', 'jobTitle'];

export const importCsv = (csv: string, csvDelimiter: string): Person[] => {
  try {
    if (!csv) return [];

    if (csvDelimiter.length !== 1) {
      throw new Error('The delimiter must be a valid character');
    }

    const records: { [Property in keyof Person]: string }[] = parse(csv, {
      delimiter: csvDelimiter,
      trim: true,
      columns: () => acceptedHeaders,
    });

    const dateFormat = getDateFormat(records);

    const results = [];

    for (const row of records) {
      const person = getPersonFromRow(row, dateFormat);

      results.push(person);
    }

    return results;
  } catch (error) {
    throw new Error(error);
  }
};

const getPersonFromRow = (
  row: {
    [Property in keyof Person]: string;
  },
  dateFormat: string | undefined,
): Person => {
  const birthdayMoment = moment(row.birthday, dateFormat);

  if (!birthdayMoment.isValid()) {
    console.warn(
      `Unable to parse birthday for ${row.firstname} ${row.lastname}`,
    );
  }

  const person: Person = {
    firstname: row.firstname,
    lastname: row.lastname,
    birthday: birthdayMoment.toDate(),
    jobTitle: row.jobTitle,
  };

  return person;
};
