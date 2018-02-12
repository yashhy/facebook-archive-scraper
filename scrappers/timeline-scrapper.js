var cheerio = require('cheerio');
var fs = require('fs');
var util = require('./utility.js');
var timeLineIndex = {};
var $timelineHTML;

function getTimeline(type) {
  let contents = timeLineIndex[type];

  if (contents === undefined) {
    return 0;
  }

  return contents;
}

module.exports = (profilePath) => {
  let fileName = 'timeline.htm';
  console.log('\t\t', fileName);
  let mainUrl = profilePath + 'html/';
  let fileUrl = mainUrl + fileName;
  $timelineHTML = cheerio.load(fs.readFileSync(fileUrl));
  timeLineIndex = util.getTimelineContents($timelineHTML);

  let dd = {};

  dd.post = getTimeline('post');
  dd.post_code = {};

  if (dd.post === 0) {
    dd.post_code.code = 0;
    dd.post_code.codeText = 'Missing';
  } else {
    dd.post_code.code = dd.post;
    dd.post_code.codeText = 'Not Missing';
  }


  dd.shares = getTimeline('shares');
  dd.shares_code = {};

  if (dd.shares === 0) {
    dd.shares_code.code = 0;
    dd.shares_code.codeText = 'Missing';
  } else {
    dd.shares_code.code = dd.shares;
    dd.shares_code.codeText = 'Not Missing';
  }


  dd.checkIns = getTimeline('checkIns');
  dd.checkIns_code = {};

  if (dd.checkIns === 0) {
    dd.checkIns_code.code = 0;
    dd.checkIns_code.codeText = 'Missing';
  } else {
    dd.checkIns_code.code = dd.checkIns;
    dd.checkIns_code.codeText = 'Not Missing';
  }

  return dd;
};