const getUserByEmail = (obj, email) => {
  for (const key in obj) {
    if (email === obj[key].email) {
      return key;
    }
  }
};

const generateRandomString = () => {
  const randString = Math.random().toString(36).slice(2);
  return randString.substring(0, 6);
};

const findKeyByVal = (obj, objKey, value) => {
  for (const keys in obj) {
    if (value === obj[keys][objKey]) return keys;
  }
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  findKeyByVal,
};
