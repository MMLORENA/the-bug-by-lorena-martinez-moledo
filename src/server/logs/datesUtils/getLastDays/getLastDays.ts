export const getLastDays = (lastDaysNumber: number) => {
  const today = new Date();
  const days = [];

  for (let pastDays = 0; pastDays < lastDaysNumber; pastDays++) {
    const date = new Date(today);
    date.setDate(today.getDate() - pastDays);

    days.unshift(date);
  }

  return days;
};
