export default token => Object.assign(
  JSON.parse(window.atob(token.split('.')[1])),
  { token }
);
