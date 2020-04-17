const express = require('express');
const compression = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const jsonToXml = require('jsontoxml');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const covid19ImpactEstimator = require('./estimator');

const app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'logs.txt'), { flags: 'a' })

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan(':method :url :status :res[-] :response-time ms', { stream: accessLogStream }));

// HOME
app.get('/', (req, res) => res.send('Welcome to the Covid 19 estimator API'));

// POST COVID19 DATA
app.post('/api/v1/on-covid-19', (req, res) => {
  const stats = covid19ImpactEstimator(req.body);
  res.status(200).json({
    data: stats.data,
    impact: stats.impact,
    severeImpact: stats.severeImpact
  });
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
  const stats = covid19ImpactEstimator(req.body);
  res.status(200).json({
    data: stats.data,
    impact: stats.impact,
    severeImpact: stats.severeImpact
  });
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
  const stats = covid19ImpactEstimator(req.body);
  res.header('content-Type', 'application/xml; charset=UTF-8');
  res.send(jsonToXml(stats));
});

app.get('/api/v1/on-covid-19/logs', (req, res) => {
  fs.readFile('./logs.txt', 'utf8', (err, data) => {
    if(err) throw err;
    res.set('Content-Type', 'text/plain');
    res.send(data);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
module.exports = app;
