import getDateParts from "../../LogManager/getDateParts/getDateParts";

// eslint-disable-next-line @typescript-eslint/naming-convention
const getLastNDays = (nLastDays: number): string[] => {
  const today = new Date();
  const days = [];

  for (let pastDays = 0; pastDays < nLastDays; pastDays++) {
    const date = new Date(today);
    date.setDate(today.getDate() - pastDays);

    const { day, month, year } = getDateParts(date);

    const formattedDate = `${day}${month}${year}`;
    days.push(formattedDate);
  }

  return days;
};

export default getLastNDays;
