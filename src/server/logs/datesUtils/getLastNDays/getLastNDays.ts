// eslint-disable-next-line @typescript-eslint/naming-convention
export const getLastNDays = (nLastDays: number) => {
  const today = new Date();
  const days = [];

  for (let pastDays = 0; pastDays < nLastDays; pastDays++) {
    const date = new Date(today);
    date.setDate(today.getDate() - pastDays);

    days.push(date);
  }

  return days;
};
