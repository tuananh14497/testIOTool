const PORT = 3000;

const express = require('express');
const app = express();
const getData = require('./modules/getData');

const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

const homePage = fs.readFileSync(`./index.html`, 'utf-8');
const helpPage = fs.readFileSync('./pages/help.html', 'utf-8');
const donatePage = fs.readFileSync('./pages/donate.html', 'utf-8');
const loginErPg = fs.readFileSync(`./pages/logInErr.html`, 'utf-8');

const template_tbRow = fs.readFileSync(`./templates/template_tbRow.html`, 'utf-8');
const template_bugTracker = fs.readFileSync(`./templates/template_bugTracker.html`, 'utf-8');

// =========================================================================================

app.use(express.urlencoded());
app.use(express.static('public'));


app.get('/', (req, res) => {
  res.end(homePage);
});

app.get('/help', (req, res) => {
  res.end(helpPage);
});

app.get('/donate', (req, res) => {
  res.end(donatePage);
});

app.post('/bugTracker', (req, res) => {
  renderAndReturn(req, res);
});

app.listen(PORT, () => {
  console.log('Listening for request on localhost:', PORT);
});

// =========================================================================================

async function renderAndReturn(req, res) {
    let Data = await getData(req.body.cookieValue);
    let output
    // console.log(Data)
    if (Data !== "logInErr") {
      let tbRow = Data.map(el => replaceTemplate(template_tbRow, el)).join('');
      for (let i = 1; i < Data.length + 1; i++) {
        tbRow = tbRow.replace('##NUMBER##', i);
      }
      output = template_bugTracker.replace('##TABLE_ROW##', tbRow);  
    } else {
      res.end(loginErPg);
    }

    res.end(output);
}
  