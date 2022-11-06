const { request } = require('express');
const express = require('express');
const app = express();
const users = require('./users.json');
const fs = require('fs');

app.use(express.json()); // Gives ability to send raw json data to API and expect it to be in the request body
app.use(express.urlencoded()); // gives ability to send url encoded bodies to the API

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.post('/', function (req, res) {
  res.send('This is a Post Request from Grouparray!!');
});

app.get('/users', function (req, res) {
  // fetch all users
  // send the user array as response to the client
  return res.json({ users });
});

// creat new user
app.post('/users', (req, res) => {
  console.log(req.body);
  // create a new user from client's request
  // save new user to existing database
  users.push(req.body.newUser);
  // save updated data to user's json

  //stringify the json data
  let stringedData = JSON.stringify(users, null, 2);

  // rewrite the file users json
  fs.writeFile('users.json', stringedData, function (err) {
    if (err) {
      return res.status(500).json({ message: err });
    }
  });

  // send back a response to client
  return res.status(200).json({ message: 'new user created' });
});

// fetch single user
app.get('/user/:id', (req, res) => {
  // fecth req.params.id
  let id = req.params.id;
  // find user with id
  let foundUser = users.find((users) => {
    return String(users.id) === id;
  });
  // return user object as response - found or not found
  if (foundUser) {
    return res.status(200).json({ user: foundUser });
  }
  // return a 404 error if user is not found
  else {
    return res.status(404).json({ message: 'user not found' });
  }
});

app.listen(3000, function () {
  console.log('Server is up and running!!!');
});
