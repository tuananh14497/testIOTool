const baseUrl = 'https://tester.test.io';

const puppeteer = require('puppeteer');

module.exports = async cookieValue => {
  let Data = [];

  console.log('cookie Value: ' + cookieValue);

  const cookie = {
    name: 'testio_session_key',
    value: cookieValue,
    domain: '.test.io',
    url: baseUrl,
    path: '/',
    httpOnly: true,
    secure: true
  };

  ExportVal = (async () => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      // headless: false
    });
    const page = await browser.newPage();
    console.log('Started');
    await page.setViewport({ width: 1280, height: 800 });
    await page.setCookie(cookie);
    await page.goto(baseUrl);
    console.log('Going To: ' + baseUrl);
    // await page.screenshot({ path: 'testio_login.png' });
    try {
      await page.click('#sidebar_tests_expander > a');
    } catch (error) {
      if (error) {
        console.log('Log In Error')
        return "logInErr"
      }
    }
    await page.waitFor(3000);

    console.log('#sidebar_tests_expander Expaned');

    await page.waitForSelector('.shave-sidebar-item.sidebar-item');

    let testCycles = await page.evaluate(() => {
      let cycles = [];

      const testCycleEl = document.querySelectorAll('li.shave-sidebar-item');

      for (let i = 0; i < testCycleEl.length; i++) {
        cycles.push({
          cycleName: testCycleEl[i].innerText,
          link: testCycleEl[i].getElementsByTagName('a')[0].getAttribute('href')
        });
      }

      return cycles;
    });

    let i = 0;
    var bugList = [];
    while (i < testCycles.length) {
      await page.goto(baseUrl + testCycles[i].link + '/bugs/my?');
      console.log('Going To: ' + baseUrl + testCycles[i].link + '/bugs/my?');

      await page.waitForSelector('.nowrap');
      await page.waitFor(1000);


      let bugsListInOneCycle = await page.evaluate(() => {
        let bugs = [];

        const bugEl = document.querySelectorAll('tr');

        for (let i = 0; i < bugEl.length; i++) {
          try {
            bugs.push({
            bugTitle: bugEl[i].getElementsByTagName('a')[0].innerText,
            link: bugEl[i].getElementsByTagName('a')[0].getAttribute('href'),
            status: bugEl[i].getElementsByTagName('label')[2].innerText
            });
          } catch(err) {
            // console.log(err);
          }
        }
        return bugs;
      });
      bugList.push(bugsListInOneCycle);
      // console.log(bugsListInOneCycle);
      i++;
    }

    i = 0;
    while (i < testCycles.length) {
      if (bugList[i].length != 0) {
        let j = 0;
        while (j < bugList[i].length) {
          let tmpStr = bugList[i][j].link;
          if (tmpStr.includes(testCycles[i].link)) {
            // console.log("Matched")

            Data.push({
              testCycle: testCycles[i].cycleName,
              cyclelink: baseUrl + testCycles[i].link,
              bugTitle: bugList[i][0].bugTitle,
              bugLink: bugList[i][0].link,
              bugStatus: bugList[i][0].status
            });
          }
          j++;
        }
      } else {
        Data.push({
          testCycle: testCycles[i].cycleName,
          cyclelink: baseUrl + testCycles[i].link,
          bugTitle: "You haven't submit any Bugs for this Cycle",
          bugLink: 'N/A',
          bugStatus: 'N/A'
        });
      }

      i++;
    }

    // console.log(Data);

    console.log('Finished');

    await page.screenshot({ path: 'testio_login.png' });
    await browser.close();

    // console.log('output from module: ');
    // console.log(Data);

    return Data;
  })();

  return ExportVal;
};
