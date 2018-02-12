var cheerio = require('cheerio');
var fs = require('fs');
var util = require('./utility.js');
var $albumHTML;

module.exports = (profilePath) => {
  let fileName = 'photos.htm';
  console.log('\t\t', fileName);
  let mainUrl = profilePath + 'html/';
  let fileUrl = mainUrl + fileName;
  $albumHTML = cheerio.load(fs.readFileSync(fileUrl));

  let dd = {};

  let ablumList = $albumHTML('div.contents div.block'),
    albumArr = [],
    coverPhotos = [];
    
  ablumList = ablumList.map((idx, item) => {
    var albumObj = {},
      $item = cheerio(item),
      albumName = ($item.find('div > a').text() || ''),
      albumLink = ($item.find('a').attr('href') || ''),
      albumThumb = ($item.find('a img').attr('src') || '');

    // if album has 0 photos
    if (albumName.length === 0) {
      let selection = $item.find('div'),
      content = cheerio(selection).contents().get(0);

      albumName = cheerio(content).text();
      albumThumb = $item.find('img').attr('src');
      albumLink = '';
    }

    albumObj.name = albumName;
    albumObj.link = albumLink.length === 0 ? albumLink : profilePath + albumLink.replace('../', '');
    albumObj.thumb = profilePath + albumThumb.replace('../', '');

    // Cover photos
    if (albumName.toLowerCase().indexOf('cover photos') !== -1) {
      coverPhotos.push({
        name: 'Cover Photos',
        link: albumObj.link,
        thumb: albumObj.thumb
      });
    }

    albumArr.push(albumObj);
    return item;
  });

  dd.album = albumArr;
  dd.album_code = {};
  if (albumArr.length === 0) {
    dd.album_code.code = 0;
    dd.album_code.codeText = 'Missing';
  } else {
    dd.album_code.code = albumArr.length;
    dd.album_code.codeText = 'Not Missing';
  }

  dd.cover_photos = coverPhotos;
  dd.cover_photos_code = {};

  if (coverPhotos.length === 0) {
    dd.cover_photos_code.code = 0;
    dd.cover_photos_code.codeText = 'Missing';
  } else {
    dd.cover_photos_code.code = coverPhotos.length;
    dd.cover_photos_code.codeText = 'Not Missing';
  }

  return dd;
};