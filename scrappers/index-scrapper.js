var cheerio = require('cheerio');
var fs = require('fs');
var util = require('./utility.js');
var tableRowIndex = {};
var $indexHTML;

function getTableContentText(type, selector) {
  let trIndex = tableRowIndex[type],
    selectionQuery = 'div.contents table tbody tr:nth-child('+ trIndex +') td';

  if (trIndex === undefined) {
    return '';
  }
  if (selector) {
    selectionQuery = selectionQuery + ' ' + selector;
    return $indexHTML(selectionQuery);
  }

  return $indexHTML(selectionQuery).text() || '';
}

module.exports = (profilePath) => {
  let fileName = 'index.htm';
  console.log('\t\t', fileName);
  let fileUrl = profilePath + fileName;
  $indexHTML = cheerio.load(fs.readFileSync(fileUrl));
  tableRowIndex = util.getTableRows($indexHTML);

  let dd = {},
      fileSelector = $indexHTML('div.contents');

  dd.full_name = fileSelector.find('h1').text().trim();
  dd.profile_url = getTableContentText('Profile');
  dd.joined_fb_date = getTableContentText('Registration Date').replace(' at ', ' ');

  let foot = $indexHTML('.footer').text() || '',
      onIdx = foot.indexOf('on');
  dd.last_updated_date = foot.substr(onIdx + 2, foot.length).trim().replace(' at ', ' ');

  let picSrc = $indexHTML('div.nav img').attr('src');

  dd.profile_pic = profilePath + picSrc;
  dd.profile_pic_code = {};
  if (picSrc.indexOf('profile.jpg') !== -1) {
    dd.profile_pic_code.code = 1;
    dd.profile_pic_code.codeText = 'Self';
  } else {
    dd.profile_pic_code.code = 0;
    dd.profile_pic_code.codeText = 'Blank';
  }


  dd.gender = getTableContentText('Gender');
  dd.gender_code = {};
  if (dd.gender.length === 0) {
    dd.gender_code.code = 0;
    dd.gender_code.codeText = 'Missing';
  } else {
    if ('Male' === dd.gender) {
      dd.gender_code.code = 1;
      dd.gender_code.codeText = 'Male';
    } else if ('Female' === dd.gender) {
      dd.gender_code.code = 2
      dd.gender_code.codeText = 'Female';
    }
  }


  dd.interested_in = getTableContentText('Intrested In');
  dd.interested_in_code = {};

  if (dd.interested_in.length === 0) {
    dd.interested_in_code.code = 0;
    dd.interested_in_code.codeText = 'Missing';
  } else {
    dd.interested_in_code.code = 1;
    dd.interested_in_code.codeText = dd.interested_in;
  }



  dd.relationship_status = getTableContentText('Relationship Status');
  dd.relationship_status_code = {};

  if (dd.relationship_status.length === 0) {
    dd.relationship_status_code.code = 0;
    dd.relationship_status_code.codeText = 'Missing';
  } else {
    if ('single' === dd.relationship_status.toLowerCase()) {
      dd.relationship_status_code.code = 1;
      dd.relationship_status_code.codeText = 'Single';
    } else if ('in a relationship' === dd.relationship_status.toLowerCase()) {
      dd.relationship_status_code.code = 2;
      dd.relationship_status_code.codeText = 'In a relationship';
    } else if ('in an open relationship' === dd.relationship_status.toLowerCase()) {
      dd.relationship_status_code.code = 3;
      dd.relationship_status_code.codeText = 'In an open relationship';
    } else if ('engaged' === dd.relationship_status.toLowerCase()) {
      dd.relationship_status_code.code = 4;
      dd.relationship_status_code.codeText = 'Engaged';
    } else if ('married' === dd.relationship_status.toLowerCase()) {
      dd.relationship_status_code.code = 4;
      dd.relationship_status_code.codeText = 'Married';
    } else if (dd.relationship_status.toLowerCase().indexOf('complicated') !== -1) {
      dd.relationship_status_code.code = 5;
      dd.relationship_status_code.codeText = 'It’s complicated';
    }
  }

  dd.looking_for = getTableContentText('Looking For');
  dd.looking_for_code = {};

  if (dd.looking_for.length === 0) {
    dd.looking_for_code.code = 0;
    dd.looking_for_code.codeText = 'Missing';
  } else {
    dd.looking_for_code.code = 1;
    dd.looking_for_code.codeText = dd.looking_for;
  }


  dd.birthday = getTableContentText('Birthday');
  dd.birthday_code = {};
  let canCalculateAge = false;

  if (dd.birthday.length === 0) {
    dd.birthday_code.code = 0;
    dd.birthday_code.codeText = 'Missing';
  } else {
    if (dd.birthday.split('/').length === 3) {
      dd.birthday_code.code = 1;
      dd.birthday_code.codeText = 'Month and day and year';
      canCalculateAge = true;

    } else if (dd.birthday.split('/').length === 2) {
      dd.birthday_code.code = 2;
      dd.birthday_code.codeText = 'Month and day';
    }
  }


  if (canCalculateAge) {
    dd.age = new Date().getFullYear() - new Date(dd.birthday).getFullYear();
  } else {
    dd.age = 'Year not specified. Age cannot be calculated.'
  }


  dd.hometown = getTableContentText('Home town/city');
  dd.hometown_code = {};
  if (dd.hometown.length === 0) {
    dd.hometown_code.code = 0;
    dd.hometown_code.codeText = 'Missing'
  } else {
    dd.hometown_code.code = 1;
    dd.hometown_code.codeText =  'Not Missing';
  }


  dd.residence = getTableContentText('Current City');
  dd.residence_code = {};
  let residenceSplit = dd.residence.split(',');

  if (dd.residence.length === 0) {
    dd.residence_code.code = 0;
    dd.residence_code.codeText = 'Missing';
  } else if (residenceSplit.length === 2) {
    dd.residence_code.code = 1;
    dd.residence_code.codeText = 'Complete';
  } else if (residenceSplit.length === 1) {
    dd.residence_code.code = 2;
    dd.residence_code.codeText = 'Partial';
  }


  let education = cheerio(getTableContentText('Education', 'p')),
      hasSchoolFound = false,
      schoolText = '',
      educationArr = [];
  education.each(function(i, element) {
    var eduText = cheerio(this).text().trim();
    educationArr.push(eduText);

    if (eduText.toLowerCase().indexOf('school') !== -1 && 
        eduText.toLowerCase().indexOf('high') !== -1) {
      hasSchoolFound = true;
      schoolText = eduText;
    }
  }, this);

  dd.education = educationArr;
  dd.education_code = {};

  if (dd.education.length === 0) {
    dd.education_code.code = 0;
    dd.education_code.codeText = 'Missing';
  } else {
    dd.education_code.code = dd.education.length;
    dd.education_code.codeText = 'Not Missing';
  }


  dd.high_school = schoolText;
  dd.high_school_code = {};

  if (dd.high_school.length === 0) {
    dd.high_school_code.code = 0;
    dd.high_school_code.codeText = 'Missing';
  } else {
    dd.high_school_code.code = 1;
    dd.high_school_code.codeText = 'Not Missing';
  }

    
  dd.class_year = '';

  dd.class_year_code = {};
  dd.class_year_code.code = 0;
  dd.class_year_code.codeText = 'Missing';

  if (dd.high_school_code.code !== 0) {
    let hasFoundClass = false,
        year = 1940;

    for (let i = year; i <= new Date().getFullYear(); i++) {
      if (dd.high_school.indexOf(i) !== -1) {
        dd.class_year = i;
        dd.class_year_code.code = i;
        dd.class_year_code.codeText = 'Not Missing';
        break;
      }
    }
  }

  let employersList = (getTableContentText('Employers', 'p')) || [],
    empList = [];

  employersList.filter((idx, item) => {
    empList.push(cheerio(item).text());
  });

  dd.employers = empList;
  dd.employers_code = {};

  if (dd.employers.length === 0) {
    dd.employers_code.code = 0;
    dd.employers_code.codeText = 'Missing';
  } else {
    dd.employers_code.code = dd.employers.length;
    dd.employers_code.codeText = 'Not Missing';
  }


  let previousNameList = getTableContentText('Previous Names', 'ul li') || [],
    nameList = [];

  previousNameList = previousNameList.map((idx, item) => {
    nameList.push(cheerio(item).text().trim());
  });

  dd.previous_name = nameList;
  dd.previous_name_code = {};

  if (dd.previous_name.length === 0) {
    dd.previous_name_code.code = 0;
    dd.previous_name_code.codeText = 'Missing';
  } else {
    dd.previous_name_code.code = dd.previous_name.length;
    dd.previous_name_code.codeText = 'Not Missing';
  }

  let FamilyList = getTableContentText('Family', 'ul li') || [],
    familyFriendsList = [];

  FamilyList = FamilyList.map((idx, item) => {
    familyFriendsList.push(cheerio(item).text().trim());
  });

  dd.family_friends = familyFriendsList;
  dd.family_friends_code = {};

  if (dd.family_friends.length === 0) {
    dd.family_friends_code.code = 0;
    dd.family_friends_code.codeText = 'Missing';
  } else {
    dd.family_friends_code.code = dd.family_friends.length;
    dd.family_friends_code.codeText = 'Not Missing';
  }


  let groupList = getTableContentText('Groups') || [];
  if (groupList.length > 0) {
    groupList = groupList.split(',');
    groupList = groupList.map((item) => { return item.trim(); });
  }

  dd.groups = groupList;
  dd.groups_code = {};

  if (dd.groups.length === 0) {
    dd.groups_code.code = 0;
    dd.groups_code.codeText = 'Missing';
  } else {
    dd.groups_code.code = dd.groups.length;
    dd.groups_code.codeText = 'Not Missing';
  }


  let intrestList = getTableContentText('Interests') || [];
  if (intrestList.length > 0) {
    intrestList = intrestList.split(',');
    intrestList = intrestList.map((item) => { return item.trim(); });
  }

  dd.interest = intrestList;
  dd.interest_code = {};

  if (dd.interest.length === 0) {
    dd.interest_code.code = 0;
    dd.interest_code.codeText = 'Missing';
  } else {
    dd.interest_code.code = dd.interest.length;
    dd.interest_code.codeText = 'Not Missing';
  }


  let musicList = getTableContentText('Music') || [];
  if (musicList.length > 0) {
    musicList = musicList.split(',');
    musicList = musicList.map((item) => { return item.trim(); });
  }

  dd.music = musicList;
  dd.music_code = {};

  if (dd.music.length === 0) {
    dd.music_code.code = 0;
    dd.music_code.codeText = 'Missing';
  } else {
    dd.music_code.code = dd.music.length;
    dd.music_code.codeText = 'Not Missing';
  }


  let televisionList = getTableContentText('Television') || [];
  if (televisionList.length > 0) {
    televisionList = televisionList.split(',');
    televisionList = televisionList.map((item) => { return item.trim(); });
  }

  dd.tv = televisionList;
  dd.tv_code = {};

  if (dd.tv.length === 0) {
    dd.tv_code.code = 0;
    dd.tv_code.codeText = 'Missing';
  } else {
    dd.tv_code.code = dd.tv.length;
    dd.tv_code.codeText = 'Not Missing';
  }


  let moviesList = getTableContentText('Movies') || [];
  if (moviesList.length > 0) {
    moviesList = moviesList.split(',');
    moviesList = moviesList.map((item) => { return item.trim(); });
  } 

  dd.movies = moviesList;
  dd.movies_code = {};

  if (dd.movies.length === 0) {
    dd.movies_code.code = 0;
    dd.movies_code.codeText = 'Missing';
  } else {
    dd.movies_code.code = dd.movies.length;
    dd.movies_code.codeText = 'Not Missing';
  }

  let sportsList = getTableContentText('Favourite sports') || [];
  if (sportsList.length > 0) {
    sportsList = sportsList.split(',');
    sportsList = sportsList.map((item) => { return item.trim(); });
  } 
  
  dd.sports = sportsList;
  dd.sports_code = {};

  if (dd.sports.length === 0) {
    dd.sports_code.code = 0;
    dd.sports_code.codeText = 'Missing';
  } else {
    dd.sports_code.code = dd.sports.length;
    dd.sports_code.codeText = 'Not Missing';
  }
  

  let booksList = getTableContentText('Books') || [];
  if (booksList.length > 0) {
    booksList = booksList.split(',');
    booksList = booksList.map((item) => { return item.trim(); });
  }

  dd.books = booksList;
  dd.books_code = {};

  if (dd.books.length === 0) {
    dd.books_code.code = 0;
    dd.books_code.codeText = 'Missing';
  } else {
    dd.books_code.code = dd.books.length;
    dd.books_code.codeText = 'Not Missing';
  }


  let applicationList = getTableContentText('Apps', 'ul li') || [],
    appList = [];

  applicationList = applicationList.map((idx, item) => {
    appList.push(cheerio(item).text().trim());
  });

  dd.apps = appList;
  dd.apps_code = {};

  if (dd.apps.length === 0) {
    dd.apps_code.code = 0;
    dd.apps_code.codeText = 'Missing';
  } else {
    dd.apps_code.code = dd.apps.length;
    dd.apps_code.codeText = 'Not Missing';
  }

  let quotesList = getTableContentText('Quotes').split(',') || [];
  quotesList = quotesList.map((item) => { return item.trim(); });

  dd.quotes = quotesList.length <= 1 ? '' : quotesList;
  dd.quotes_code = {};

  if (dd.quotes.length <= 1) {
    dd.quotes_code.code = 0;
    dd.quotes_code.codeText = 'Missing';
  } else {
    dd.quotes_code.code = dd.quotes.length;
    dd.quotes_code.codeText = 'Not Missing';
  }


  dd.about_me = getTableContentText('About Me');
  dd.about_me_code = {};
  let paraLength = 65;

  if (dd.about_me.length === 0) {
    dd.about_me_code.code = 0;
    dd.about_me_code.codeText = 'Missing';
  } else if (dd.about_me.length < paraLength * 2) {
    dd.about_me_code.code = 1;
    dd.about_me_code.codeText = 'One or two short sentences';
  } else if (dd.about_me.length > paraLength * 2 && dd.about_me.length < paraLength * 6) {
    dd.about_me_code.code = 2;
    dd.about_me_code.codeText = 'One or two short paragraphs';
  } else if (dd.about_me.length > paraLength * 6) {
    dd.about_me_code.code = 3;
    dd.about_me_code.codeText = 'Long paragraphs';
  }


  let activitiesList = getTableContentText('Activities').split(',');
  activitiesList = activitiesList.map((item) => { return item.trim(); });

  dd.activities = activitiesList;
  dd.activities_code = {};

  if (dd.activities.length === 1) {
    dd.activities_code.code = 0;
    dd.activities_code.codeText = 'Missing';
  } else {
    dd.activities_code.code = dd.activities.length;
    dd.activities_code.codeText = 'Not Missing';
  }


  return dd;
}