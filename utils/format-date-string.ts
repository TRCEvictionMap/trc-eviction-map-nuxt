const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDateString(dateString: string) {
  if (!/\d{4}-\d{1,2}/.test(dateString)) {
    return;
  }
  
  let [y, m] = dateString.split("-");

  m = MONTHS[Number.parseInt(m) - 1];

  return { y, m, mAbbr: m.slice(0, 3) };
}

export { formatDateString };
