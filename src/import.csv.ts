import { parse } from 'csv-parse/dist/cjs/sync.cjs';
import { Person } from './types';
import moment = require('moment');
import { getDateFormat } from './getDateFormat';

export const importCsv = (csv: string, csvDelimiter: string): Person[] => {
  const results = [];

  const records = parse(csv, {
    delimiter: csvDelimiter,
    columns: true,
    trim: true,
  });

  const dateFormat = getDateFormat(records);

  for (const row of records) {
    const birthday = moment(row.birthday, dateFormat).toDate();

    const person: Person = {
      firstname: row.firstname,
      lastname: row.lastname,
      birthday,
      jobTitle: row['job title'],
    };

    results.push(person);
  }

  return results;
};
