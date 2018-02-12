const { lstatSync, readdirSync, writeFile, existsSync } = require('fs');
const { join } = require('path');

var jsonUtil = require('./jsonUtility.js');

var indexScrapper = require('./scrappers/index-scrapper.js');
var contactScrapper = require('./scrappers/contact-scrapper.js');
var friendsScrapper = require('./scrappers/friends-scrapper.js');
var albumScrapper = require('./scrappers/album-scrapper.js');
var timelineScrapper = require('./scrappers/timeline-scrapper.js');
var videoScrapper = require('./scrappers/video-scrapper.js');
var eventsScrapper = require('./scrappers/events-scrapper.js');

const isDirectory = source => lstatSync(source).isDirectory();
const getProfilesArray = source => {
 return readdirSync(source).map(name => {
   var dir = join(source, name);
    if (isDirectory(dir)) {
      return './' + dir + '/';
    }
 });
};
const defaultScrapperDirectory = './profiles';
var startTime = new Date();

if (!existsSync(defaultScrapperDirectory)) {
  console.log('Oops! The path you gave to scrap not found!');
  console.log('\t\tPlease follow instruction given in README.md to download a profile and place it in the folder to scrap.');
  console.log('\t\thttps://github.com/yashhy/facebook-archive-scrapper#facebook-archive-scrapper');
  return;
}

let profileArray = getProfilesArray(defaultScrapperDirectory).filter(val => val !== undefined),
  masterJsonArray = [];

for (let i = 0; i < profileArray.length; i++) {
  let profileUrl = profileArray[i];
  if (stopScrapingProfile(profileUrl)) {
    console.log('Scrapping Skipped.... ', profileUrl, ' Profile : ' + (i + 1) + ' of ' + profileArray.length);
    continue;
  }
  console.log('Scrapping Inprogress.... ', profileUrl, ' Profile : ' + (i + 1) + ' of ' + profileArray.length);
  let indexHtmlJson = indexScrapper(profileUrl),
    contactHtmlJson = contactScrapper(profileUrl),
    friendsHtmlJson = friendsScrapper(profileUrl),
    albumHtmlJson = albumScrapper(profileUrl),
    timelinelJson = timelineScrapper(profileUrl),
    videoHtmlJson = videoScrapper(profileUrl),
    eventsHtmlJson = eventsScrapper(profileUrl);

  let outputJson = Object.assign({},
                    indexHtmlJson,
                    contactHtmlJson,
                    friendsHtmlJson,
                    albumHtmlJson,
                    timelinelJson,
                    videoHtmlJson,
                    eventsHtmlJson);

  masterJsonArray.push(outputJson);
}

function stopScrapingProfile(profileUrl) {
  let url = profileUrl.replace('./profiles/', ''),
    contact = url.charAt(0) + url.charAt(1);
    
  return contact === 'x-';
}

let genderConsolidatedJson = {
  totalProfilesCount: 0,
  male: {},
  female: {},
  unknown: {}
},
  maleCount = 0,
  femaleCount = 0,
  unknownCount = 0;

for (key in masterJsonArray) {
  let profile = masterJsonArray[key];

  if ('Male' === profile.gender) {
    let maleReport = jsonUtil.getReport(genderConsolidatedJson.male, profile);
    genderConsolidatedJson.male = Object.assign({}, maleReport);
    maleCount++;
  } else if ('Female' === profile.gender) {
    let femaleReport = jsonUtil.getReport(genderConsolidatedJson.female, profile);
    genderConsolidatedJson.female = Object.assign({}, femaleReport);
    femaleCount++;
  } else {
    let unknownReport = jsonUtil.getReport(genderConsolidatedJson.unknown, profile);
    genderConsolidatedJson.unknown = Object.assign({}, unknownReport);
    unknownCount++;
  }
}
genderConsolidatedJson.totalProfilesCount = masterJsonArray.length;
genderConsolidatedJson.male.total = maleCount;
genderConsolidatedJson.female.total = femaleCount;
genderConsolidatedJson.unknown.total = unknownCount;

writeFile('master.json', JSON.stringify(masterJsonArray, null, 2));
writeFile('gender.json', JSON.stringify(genderConsolidatedJson, null , 2));

var endTime = new Date();

console.log('Total time : ', (endTime.getTime() - startTime.getTime()) / 1000, 's');