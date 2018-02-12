var cheerio = require('cheerio');
var fs = require('fs');
var util = require('./utility.js');
var tableRowIndex = {};
var $contactHTML;

function getTableContentText(type, selector) {
  let trIndex = tableRowIndex[type],
    selectionQuery = 'div.contents table tbody tr:nth-child('+ trIndex +') td';

  if (trIndex === undefined) {
    return '';
  }
  if (selector) {
    selectionQuery = selectionQuery + ' ' + selector;
    return $contactHTML(selectionQuery);
  }

  return $contactHTML(selectionQuery).text() || '';
}

module.exports = (profilePath) => {
  let fileName = 'contact_info.htm';
  console.log('\t\t', fileName);
  let mainUrl = profilePath + 'html/';
  let fileUrl = mainUrl + fileName;
  $contactHTML = cheerio.load(fs.readFileSync(fileUrl));
  tableRowIndex = util.getTableRows($contactHTML);

  let dd = {};

  dd.contact = {};

  dd.contact.address = getTableContentText('Address');
  dd.contact.email_address = [];

  let emailRawList = (getTableContentText('Email addresses', '> li') || getTableContentText('Emails', '> li')) || cheerio([]),
    emailList = [];
  emailRawList = emailRawList.each((idx, item) => {
    let itemText = cheerio(item).text();
    if (itemText.indexOf('@') !== -1) {
      emailList.push(itemText);
    }
  });
  dd.contact.email_address = emailList;



  let phoneRawList = getTableContentText('Phones', '> ul li'),  
    phoneList = [];

  if (phoneRawList) {
    phoneRawList.each((idx, item) => {
      phoneList.push(cheerio(item).text().replace(' Mobile ', ''));
    });
  }

  dd.contact.phone = phoneList;


  let screenNameRawList = getTableContentText('Screenname', '> ul li'),  
    screenNameList = [];

  if (screenNameRawList) {
    screenNameRawList.each((idx, item) => {
      screenNameList.push(cheerio(item).text());
    });
  }

  dd.contact.screen_name = screenNameList;

  dd.contact.website = getTableContentText('Website');

  dd.contact_code = {};
  let codeTextArr = [],
    codeArr = [];

  if (dd.contact.email_address.length > 0) {
    codeArr.push(1);
    codeTextArr.push('Email address');
  }
  
  if (dd.contact.screen_name.length > 0) {
    codeArr.push(2);
    codeTextArr.push('IM screen name');
  }

  if (dd.contact.phone.length > 0) {
    codeArr.push(3);
    codeTextArr.push('Mobile phone/land phone');
  }

  if (dd.contact.website.length > 0) {
    codeArr.push(4);
    codeTextArr.push('Website');
  }

  if (codeTextArr.length === 0 && codeArr.length === 0) {
    dd.contact_code.code = 0;
    dd.contact_code.codeText = 'Missing';
  } else {
    dd.contact_code.code = codeArr.join(', ');
    dd.contact_code.codeText = codeTextArr.join(', ');
  }  

  return dd;
}