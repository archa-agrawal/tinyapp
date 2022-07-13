const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const generateRandomString = () => {
  const randString = Math.random().toString(36).slice(2);
  return randString.substring(0, 6);
}

const lookForObjectKeys = (obj, objKey, qKey) => {
  for (const key in obj) {
    if (qKey === obj[key][objKey]) {
      return true;
    }
  }
  return false;
}
const findKeyByVal = (obj, objKey, value) => {
  for (const key in obj) {
    if(value === obj[key][objKey])
    return key
  }
}

app.get("/", (req, res) => {
  res.send("Hello!");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
app.get('/urls', (req, res) => {
  const id = req.cookies['user_id']
  const user = users[id]
  const templateVar = {user: user, urls: urlDatabase};
  res.render('urls_index', templateVar)
});
app.get('/urls/new', (req, res) => {
  const id = req.cookies['user_id']
  const user = users[id]
  const templateVar = {user: user,}
  res.render('urls_new', templateVar);
});
app.get('/register', (req, res) => {
  const id = req.cookies['user_id']
  const user = users[id]
  const templateVar = {user: user,}
  res.render('urls_registration', templateVar);
});
app.get('/login', (req, res) => {
  const id = req.cookies['user_id']
  const user = users[id]
  const templateVar = {user: user,}
  res.render('urls_login', templateVar);
});
app.post('/urls', (req, res) => {
  const id = generateRandomString();
  const url = req.body; 
  urlDatabase[id] = url.longURL
  res.redirect(`/urls/${id}`);
});
app.get('/urls/:id', (req, res) => {
  const id = req.cookies['user_id']
  const user = users[id]
  const templateVar = {user: user, id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render('urls_show', templateVar)
});
app.get('/u/:id', (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
})
app.post('/urls/:id/edit', (req, res) => {
  const id = req.cookies['user_id']
  const user = users[id]
  const templateVar = {user: user, id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render('urls_show', templateVar)
});
app.post('/urls/:id/update', (req, res) => {
  const id = req.params.id
  const newURL = (req.body)['New URL']
  urlDatabase[id] = newURL;
  res.redirect('/urls');
});
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!lookForObjectKeys(users, 'email', email)) {
    return res.send('Error: 403; email not found')
  } else if (!lookForObjectKeys(users, 'password', password)) {
    return res.send('Error: 403; password does not match')
  }
  const id = findKeyByVal(users, 'email', email);
  res.cookie('user_id', id)
  res.redirect('/urls');
});
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});
app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  if (email === '' || password === '') {
    return res.send('Error:400; Invalid email or password')
  }
  if (lookForObjectKeys(users, 'email', email)) {
    return res.send('Error:400; user already exists')
  }
  users[id] = {id, email, password };
  res.cookie('user_id', id)
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


