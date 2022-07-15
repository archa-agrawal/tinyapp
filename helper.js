
const getUserByEmail  = (obj, email) => {
  for (const key in obj) {
    if (email === obj[key].email) {
      return key;
    }
  }
};

module.exports = getUserByEmail;