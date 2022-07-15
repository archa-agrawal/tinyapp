/**
 * This function returns user that has the given email id.
 * @param {object} users
 * @param {string} email
 * @returns {string} Id of the maching user
 */
const getUserByEmail = (users, email) => {
  for (const userId in users) {
    if (email === users[userId].email) {
      return userId;
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
