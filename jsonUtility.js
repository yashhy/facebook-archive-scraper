let obj = {}

obj.getReport = function (fullGenderReport, currentProfile) {
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'profile_pic_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'interested_in_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'relationship_status_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'looking_for_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'birthday_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'hometown_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'residence_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'contact_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'previous_name_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'family_friends_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'employers_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'high_school_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'class_year_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'friends_others_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'groups_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'activities_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'interest_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'music_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'tv_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'movies_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'sports_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'books_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'apps_code');  
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'quotes_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'about_me_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'cover_photos_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'album_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'video_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'post_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'shares_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'checkIns_code');
  fullGenderReport = this.getItem(fullGenderReport, currentProfile, 'events_code');
  return fullGenderReport;
};

obj.getItem = function (fullGenderReport, currentProfile, item) {
  var currentProfileCodeText = (currentProfile[item] && currentProfile[item]['codeText']);

  if (currentProfileCodeText) {
    if (fullGenderReport[item] === undefined) {
      fullGenderReport[item] = {};
      fullGenderReport[item][currentProfileCodeText] = 1;
    } else {
      let val = fullGenderReport[item][currentProfileCodeText];
      if (val) {
        fullGenderReport[item][currentProfileCodeText] = (val + 1);
      } else {
        fullGenderReport[item][currentProfileCodeText] = 1;
      }
    }
  } else {
    fullGenderReport[item] = 0;
  }
  
  return fullGenderReport;
};

module.exports = obj;
