var cheerio = require('cheerio');
var fs = require('fs');
var $videoHTML;

module.exports = (profilePath) => {
  let fileName = 'videos.htm';
  console.log('\t\t', fileName);
  let mainUrl = profilePath + 'html/';
  let fileUrl = mainUrl + fileName;
  $videoHTML = cheerio.load(fs.readFileSync(fileUrl));

  let dd = {},
    videoList = [];

  $videoHTML('div.contents .block').map((idx, item) => {

    var obj = {
        link: '',
        thumb: '',
        name: 'Video'
      },
      $item = cheerio(item),
      anchorTag = $item.find('a').eq(1).attr('href'),
      imageTag = $item.find('a').eq(1).find('img').attr('src');

    if (!$item.find('div').hasClass('warning')) {
      anchorTag =  $item.find('a').attr('href');
      imageTag = $item.find('img').attr('src');

      obj.link = profilePath;
    }

    obj.link += (anchorTag || '').replace('../', '');
    obj.thumb = profilePath + (imageTag || '').replace('../', '');
    
    $item.contents().map((idx1, video) => {
      if (video.nodeType === 3) {
        obj.name = (cheerio(video).text() || '').trim();
      }
    });

    videoList.push(obj);
  });

  dd.video = videoList;
  dd.video_code = {};
  
  if (dd.video === 0) {
    dd.video_code.code = 0;
    dd.video_code.codeText = 'Missing';
  } else {
    dd.video_code.code = dd.video.length;
    dd.video_code.codeText = 'Not Missing';
  }

  return dd;
};