var cheerio = require('cheerio');
var fs = require('fs');
var util = require('./utility.js');
var friendListsIndex = {};
var $friendsHTML;

function getFriendsContentList(type, selector) {
  let trIndex = friendListsIndex[type];

  if (trIndex === undefined) {
    return '';
  }

  return trIndex;
}

module.exports = (profilePath) => {
  let fileName = 'friends.htm';
  console.log('\t\t', fileName);
  let mainUrl = profilePath + 'html/';
  let fileUrl = mainUrl + fileName;
  $friendsHTML = cheerio.load(fs.readFileSync(fileUrl));
  friendListsIndex = util.getFriendsObj($friendsHTML);

  let dd = {};

  dd.friends_campus = '';
  dd.friends_campus_code = '';

  dd.friends_others = getFriendsContentList('Friends');
  dd.friends_others_code = {}

  if (dd.friends_others.length === 0) {
    dd.friends_others_code.code = 0;
    dd.friends_others_code.codeText = 'Missing';
  } else {
    dd.friends_others_code.code = dd.friends_others.length;
    dd.friends_others_code.codeText = 'Not Missing';
  }

  return dd;
};