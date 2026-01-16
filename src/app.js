const express = require('express');
const app = express();

app.use('/test', (req, res) => {
  res.send('Test route is working!');
});

app.get('/user', (req, res) => {
  res.send({ firstName: 'John', lastName: 'Doe' });
});

app.post('/user', (req, res) => {
  console.log('POST request received at /user');
  res.send('Data received via POST request');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



