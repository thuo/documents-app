const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getOrdinal(number) {
  if (number > 10 && number < 20) {
    return 'th';
  }
  switch (number % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export default date => {
  const d = new Date(date);
  const day = d.getDate();
  const ordinal = getOrdinal(day);
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours();
  let minutes = d.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  const period = hours < 12 ? 'am' : 'pm';
  return `${day}${ordinal} ${month} ${year}, ${hours % 12}:${minutes}${period}`;
};
