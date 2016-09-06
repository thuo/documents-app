export default date => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const locale = window.navigator.language || window.navigator.languages[0];
  return new Date(date).toLocaleDateString(locale, options);
};
