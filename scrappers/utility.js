var cheerio = require('cheerio');

obj = {};

obj.getTableRows = function ($indexHTML) {
  let tableRowObj = {},
      tableRow = $indexHTML('div.contents table tbody tr');

  tableRow.each(function (idx, item) {
    let tableHeader = cheerio(this).find('th');
    tableRowObj[tableHeader.text()] = idx + 1;
  });

  return tableRowObj;
};

obj.getFriendsObj = function ($friendsHTML) {
  let frdsObj = {},
    frdsHeaderHTML = $friendsHTML('div.contents div h2');
    if (frdsHeaderHTML.length === 0) {
      frdsHeaderHTML = $friendsHTML('div.contents h2');
    }
    frdsHeaderHTML.each((idx, item) => {
      let frdsHeader = cheerio(item).text();
      frdsObj[frdsHeader] = getListItems($friendsHTML, 0);
    });

    return frdsObj;
};

function getListItems($friendsHTML, index) {
  let frdsListUL = $friendsHTML('div.contents div ul');
  if (frdsListUL.length === 0) {
    frdsListUL = $friendsHTML('div.contents ul');
  }

  let frdsListHTML = frdsListUL.eq(index).find('li'),
    frdsList = [];

  frdsListHTML.each((idx, item) => {
    let frd = cheerio(item).text(),
      name = frd.substr(0, frd.indexOf('(')).trim();
      date = frd.substring(frd.indexOf('(') + 1, frd.indexOf(')'));
    let frdObj = {
      name: name,
      date: getDate(date, $friendsHTML('div.footer').text())
    };

    frdsList.push(frdObj);
  })

  return frdsList;
}

function getDate(dateString, footerText) {
  let dateObj = new Date();
  try {
    if ('Today' === dateString) {
      var dateString = ((footerText || '').split('on')[1] || '').replace('at ', '');
      let todayDate = new Date(dateString);
      return todayDate.toDateString();
    } else if ('Yesterday' === dateString) {
      var dateString = ((footerText || '').split('on')[1] || '').replace('at ', '');
      var todayDate = new Date(dateString);
      var dateYesterday = todayDate.setDate(todayDate.getDate() - 1);
      return new Date(dateYesterday).toDateString();
    } else if (dateString.split(' ').length === 2) {
      let date = new Date(dateString).setFullYear(dateObj.getFullYear());
      return new Date(date).toDateString();
    } else if (dateString.split(' ').length === 3) {
      return new Date(dateString).toDateString();
    }
  } catch (e) {
    return 'Error! in getDate() utility.js'
  }
}

obj.getTimelineContents = function($timelineHtml) {
  let timeLineObj = {}
    contents = $timelineHtml('div.contents'),
    profileName = $timelineHtml('h1').text().trim(),
    sharesCount = 0,
    checkInsCount = 0;
  
  timeLineObj.post = cheerio(contents).find('div.comment').length;

  cheerio(contents).find('div')
    .contents() 
    .map(function() { 
      if (this.nodeType == 3) {
        let text = cheerio(this).text()  || '';
        if ((text.indexOf(profileName + ' shared') !== -1)) {
          sharesCount++;
        } else if ((text.indexOf(profileName + ' checked in to') !== -1)) {
          checkInsCount++;
        }
      }
    }); 

  timeLineObj.shares = sharesCount;
  timeLineObj.checkIns = checkInsCount;
                      
  return timeLineObj;
};

module.exports = obj;