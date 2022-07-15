/**
 * This function returns user that has the given email id.
 * @param {object} users users database
 * @param {string} email email to search
 * @returns {string} Id of the maching user
 */
const getUserByEmail = (users, email) => {
  for (const userId in users) {
    if (email === users[userId].email) {
      return userId;
    }
  }
};

/**
 * This function generates random six character string.
 * @returns {string} 6 characters-long string
 */
const generateRandomString = () => {
  const randString = Math.random().toString(36).slice(2);
  return randString.substring(0, 6);
};

/**
 * This function returns url id owned by the user.
 * @param {object} urls This is database of urls
 * @param {string} userId This is id unique to each user
 * @returns urls specific to the given user id
 */
const urlsForUser = (urls, userId) => {
  const userURLs = {};
  for (const urlId in urls) {
    if (userId === urls[urlId].userID) {
      userURLs[urlId] = urls[urlId].longURL;
    }
  }
  return userURLs;
};

module.exports = {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
};
