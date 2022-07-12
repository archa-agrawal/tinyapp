const express = require("express");
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const generateRandomString = () => {
  const randString = Math.random().toString(36).slice(2)
  return randString.substring(0, 6)
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
  const templateVar = {urls: urlDatabase};
  res.render('urls_index', templateVar)
});
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});
app.post('/urls', (req, res) => {
  const id = generateRandomString();
  const url = req.body; 
  urlDatabase[id] = url.longURL
  res.redirect(`/urls/${id}`);
});
app.get('/urls/:id', (req, res) => {
  const templateVar = {id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render('urls_show', templateVar)
});
app.get('/u/:id', (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  res.redirect(longURL);
});
app.post('/urls/:id/delete', (req, res) => {
  const id = req.params.id;
  console.log(req.body)
  delete urlDatabase[id];
  res.redirect('/urls');
})
app.post('/urls/:id/edit', (req, res) => {
  const templateVar = {id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render('urls_show', templateVar)
});
app.post('/urls/:id/update', (req, res) => {
  const id = req.params.id
  const newURL = (req.body)['New URL']
  urlDatabase[id] = newURL;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


