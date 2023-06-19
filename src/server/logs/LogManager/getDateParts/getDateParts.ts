export interface DateParts {
  year: string;
  month: string;
  day: string;
}

const getDateParts = (date: Date): DateParts => {
  const dateMaxLength = 2;
  const dateFormatFill = "0";

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1)
    .toString()
    .padStart(dateMaxLength, dateFormatFill);
  const day = date.getDate().toString().padStart(dateMaxLength, dateFormatFill);

  return {
    year,
    month,
    day,
  };
};

export default getDateParts;
