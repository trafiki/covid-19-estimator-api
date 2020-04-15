const express = require('express');
const covid19ImpactEstimator = require('./estimator');

const app = express();
app.use(express.json());

// HOME
app.get('/', (req, res) => res.send('Welcome to the genre API'));

// POST COVID19 DATA
app.post('/api/v1/on-covid-19', (req, res) => {
  res.send(covid19ImpactEstimator(req.body));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
module.exports = app;
