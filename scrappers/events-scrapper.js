var cheerio = require('cheerio');
var fs = require('fs');
var $eventsHTML;

module.exports = (profilePath) => {
  let fileName = 'events.htm';
  console.log('\t\t', fileName);
  let mainUrl = profilePath + 'html/';
  let fileUrl = mainUrl + fileName;
  $eventsHTML = cheerio.load(fs.readFileSync(fileUrl));

  let dd = {},
    eventsList = [];

    ($eventsHTML('div.contents ul li') || []).map((idx, item) => {
      let eventName = (cheerio(item).contents().filter((idx2, item2) => { return item2.nodeType === 3;}).text()) || '';
      if (eventName) {
        eventsList.push(eventName);
      }
    });
  
  dd.events = eventsList;
  dd.events_code = {};
  
  if (dd.events === 0) {
    dd.events_code.code = 0;
    dd.events_code.codeText = 'Missing';
  } else {
    dd.events_code.code = dd.events.length;
    dd.events_code.codeText = 'Not Missing';
  }

  return dd;
};