function timeToString(time, includeMillis = true) {
  // Milliseconds
  let millis = ('00' + (time % 1000)).substr(-3);
  let secs = ('0' + ((time % (60 * 1000)) - millis) / 1000).substr(-2);
  let mins = ('0' + ((((time % (60 * 60 * 1000)) - millis) / 1000) - secs) / 60).substr(-2);
  return mins + ':' + secs + (includeMillis ? '.' + millis : '');
}

function timeToDateString(time) {
  let date = new Date(time);
  return date.getFullYear() + '-' + zeroPad(date.getMonth() + 1) + '-' + zeroPad(date.getDate());
}

function timeToTimeString(time, includeMillis = false) {
  let date = new Date(time);
  let ret = zeroPad(date.getHours()) + ':' + zeroPad(date.getMinutes()) + ':' + zeroPad(date.getSeconds());
  if (includeMillis) {
    ret = ret + '.' + zeroPad(date.getMilliseconds(), 3);
  }
  return ret;
}

function msToDuration(ms) {
  let tmp = timeToString(ms, false);
  return tmp.replace(':', 'm') + 's';
}

function dateTimeToString(time, includeMillis = false) {
  let date = new Date(time);
  let ret = date.getFullYear() + '-' + zeroPad(date.getMonth() + 1) + '-' + zeroPad(date.getDate());
  ret = ret + ' ' + zeroPad(date.getHours()) + ':' + zeroPad(date.getMinutes()) + ':' + zeroPad(date.getSeconds());
  if (includeMillis) {
    ret = ret + '.' + date.getMilliseconds();
  }
  return ret;
}

function zeroPad(str, len = 2) {
  return ('' + str).padStart(len, '0')
}

function properCase(str) {
  /*
  return str.replace(/\b\w+/g, match => {
    return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
  }).replace(/['’”‘“][A-Z]{1}\b/g, match => {
    return match.toLowerCase();
  });
  */
  return str.replace(
    /([^\W_]+[^\s-]*) */g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}