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
    await page.waitFor(1000);

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

      // await page.waitForSelector('.nowrap');
      await page.waitFor(500);


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

    // console.log(bugList)

    i = 0;
    
    for (let i = 0; i < bugList.length; i++) {
      if (bugList[i].length > 0) {
        for (let j = 0; j < bugList[i].length; j++) {
          for (let k = 0; k < testCycles.length; k++) {
            tmpStr = bugList[i][j].link;
            if (tmpStr.includes(testCycles[k].link)) {
              Data.push({
                testCycle: testCycles[k].cycleName,
                cyclelink: baseUrl + testCycles[i].link,
                bugTitle: bugList[i][j].bugTitle,
                bugLink: bugList[i][j].link,
                bugStatus: bugList[i][j].status
              });
            }
          }
        }
      } else {
            Data.push({
              testCycle: testCycles[i].cycleName,
              cyclelink: baseUrl + testCycles[i].link,
              bugTitle: "You haven't submit any Bugs for this Cycle",
              bugLink: '#',
              bugStatus: 'N/A'
            });
          }
      
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
