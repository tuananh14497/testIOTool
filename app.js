const express = require('express');
const app = express();
const getData = require('./modules/getData');

const fs = require('fs');
const replaceTemplate = require('./modules/replaceTemplate');

const homePage = fs.readFileSync(`./index.html`, 'utf-8');
const helpPage = fs.readFileSync('./pages/help.html', 'utf-8');
const donatePage = fs.readFileSync('./pages/donate.html', 'utf-8');



const template_tbRow = fs.readFileSync(
  `./templates/template_tbRow.html`,
  'utf-8'
);

const template_bugTracker = fs.readFileSync(
  `./templates/template_bugTracker.html`,
  'utf-8'
);

app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.end(homePage);
});

app.get('/help', (req, res) => {
  res.end(helpPage);
});

app.get('/donate', (req, res) => {
  res.end(donatePage);
});

app.post('/submit-form', (req, res) => {
  renderAndReturn(req, res);
});

app.listen(3000, () => {
  console.log('Listening for request on localhost:3000...');
});

// testio_session_key	02e4c8f309601069a81f36e4a7aaf06d	.test.io	/	3/13/2020, 10:44:16 PM	50 B	✓	✓


async function renderAndReturn(req, res) {
    let Data = await getData(req.body.cookieValue);
    let output
    // console.log(Data)
    if (Data.length !== 0) {
      let tbRow = Data.map(el => replaceTemplate(template_tbRow, el)).join('');
      for (let i = 1; i < Data.length + 1; i++) {
        tbRow = tbRow.replace('##NUMBER##', i);
      }
      output = template_bugTracker.replace('##TABLE_ROW##', tbRow);  
    } else {
      res.writeHead(404, {
        'Content-type': 'text/html'
      });
      res.end("Something went wrong while getting Data")
    }

    res.end(output);
}
  