const express = require("express");
const cookieSession = require("cookie-session");
const bcrypt = require("bcryptjs");
const {
  getUserByEmail,
  generateRandomString,
  urlsForUser,
} = require("./helper");

// setting up databases
const urlDatabase = {};
const users = {};

// setting up express server
const app = express();
const PORT = 8080;
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["really strong key", "13678g!hui76?"],
  })
);
app.use(express.urlencoded({ extended: true }));

// home endpoints

app.get("/", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.redirect("/login");
  }
  res.redirect("/urls");
});

//Methods for user management endpoints

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  if (userId && users[userId]) {
    return res.redirect("/urls");
  }
  req.session = null;
  const templateVar = { user: undefined };
  res.render("urls_registration", templateVar);
});

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!email || !password) {
    res.status(400);
    return res.send("Error:400; Invalid email or password");
  }
  if (getUserByEmail(users, email)) {
    res.status(400);
    return res.send("Error:400; user already exists");
  }
  users[id] = { id, email, hashedPassword };
  req.session.user_id = id; // eslint-disable-line camelcase
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  if (userId && users[userId]) {
    return res.redirect("/urls");
  }
  req.session = null;
  const templateVar = { user: undefined };
  res.render("urls_login", templateVar);
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!getUserByEmail(users, email)) {
    res.status(403);
    return res.send("Error: 403; email not found");
  }
  const id = getUserByEmail(users, email);
  const userPassword = users[id].hashedPassword;
  if (!bcrypt.compareSync(password, userPassword)) {
    res.status(403);
    return res.send("Error: 403; password does not match");
  }
  req.session.user_id = id; // eslint-disable-line camelcase
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// This endpoint gets the /urls page

app.get("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.status(401);
    return res.send("Error: 401; User not logged in!");
  }
  const user = users[userId];
  if (!user) {
    req.session = null;
    res.status(404);
    return res.send("Error: 404; User not found!");
  }
  const userUrlDatabase = urlsForUser(urlDatabase, userId);
  const templateVar = { user: user, urls: userUrlDatabase };
  res.render("urls_index", templateVar);
});

//This endpoint gets the new URL page
app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  if (!userId || !users[userId]) {
    req.session = null;
    return res.redirect("/login");
  }
  const user = users[userId];
  const templateVar = { user: user };
  return res.render("urls_new", templateVar);
});

// This endpoint registers a new url
app.post("/urls", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.status(401);
    return res.send("Error : 401, user not looged in");
  }
  if (!users[userId]) {
    req.session = null;
    res.status(404);
    return res.send("Error: 404; User not found!");
  }
  const id = generateRandomString();
  const url = req.body;
  urlDatabase[id] = { longURL: url.longURL, userID: userId };
  return res.redirect(`/urls/${id}`);
});

// This endpoint gets the edit url page
app.get("/urls/:id", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.status(401);
    return res.send("Error : 401, user not looged in");
  }
  if (!users[userId]) {
    req.session = null;
    res.status(404);
    return res.send("Error: 404; User not found!");
  }
  const id = req.params.id;
  if (!urlDatabase[id]) {
    res.status(404);
    return res.send("Error : 404, id not found");
  }
  const userUrlData = urlsForUser(urlDatabase, userId);
  if (!userUrlData[id]) {
    res.status(403);
    return res.send("Error: 403, access denied");
  }
  const user = users[userId];
  const templateVar = {
    user: user,
    id: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
  };
  res.render("urls_show", templateVar);
});

// This endpoint edits/updates the url
app.post("/urls/:id/update", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.status(401);
    return res.send("Error : 401, user not looged in");
  }
  if (!users[userId]) {
    req.session = null;
    res.status(404);
    return res.send("Error: 404; User not found!");
  }
  const id = req.params.id;
  if (!urlDatabase[id]) {
    res.status(404);
    return res.send("Error : 404, id not found");
  }
  const newURL = req.body["New URL"];
  urlDatabase[id].longURL = newURL;
  res.redirect("/urls");
});

//This endpoint deletes the url
app.post("/urls/:id/delete", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    res.status(401);
    return res.send("Error : 401, user not looged in");
  }
  if (!users[userId]) {
    req.session = null;
    res.status(404);
    return res.send("Error: 404; User not found!");
  }
  const id = req.params.id;
  if (!urlDatabase[id]) {
    res.status(404);
    return res.send("Error : 404, id not found");
  }
  const userUrlData = urlsForUser(urlDatabase, userId);
  if (!userUrlData[id]) {
    res.status(403);
    return res.send("Error: 403, access denied");
  }
  delete urlDatabase[id];
  res.redirect("/urls");
});

// This endpoint redirects to long URL
app.get("/u/:id", (req, res) => {
  const id = req.params.id;
  if (!urlDatabase[id]) {
    res.status(404);
    return res.send("Error : 404, id not found");
  }
  res.redirect(urlDatabase[id].longURL);
});

// Starting express server
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
