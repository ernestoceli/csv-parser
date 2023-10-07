import moment = require('moment');

const possibleDateFormats = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY/MM/DD'];

export const getDateFormat = (rows: { birthday: string }[]): string => {
  let inferredDateFormat = null;

  for (const dateFormat of possibleDateFormats) {
    const isValidFormat = rows.every(row =>
      moment(row.birthday, dateFormat).isValid(),
    );

    if (isValidFormat) {
      inferredDateFormat = dateFormat;
      break;
    }
  }

  return inferredDateFormat ?? 'DD/MM/YYYY';
};
