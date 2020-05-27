'use strict';

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
  if (includeMillis)
    ret = ret + '.' + zeroPad(date.getMilliseconds(), 3);

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
  if (includeMillis)
    ret = ret + '.' + date.getMilliseconds();

  return ret;
}

function zeroPad(str, len = 2) {
  return ('' + str).padStart(len, '0');
}

function properCase(str) {
  return str.replace(/([^\W_]+[^\s-]*) */g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function spacePadLeft(str, len) {
  return str.padStart(len, ' ');
}

function showModal(selector) {
  let modal = document.querySelector(selector);
  let body = document.body;
  let backdrop = document.querySelector('.modal-backdrop');
  body.classList.add('modal-open');
  backdrop.classList.add('show');
  backdrop.classList.remove('hide');
  modal.classList.add('show');
  modal.style.display = 'block';
}

function hideModal(selector = '.modal.show') {
  let modal = document.querySelector(selector);
  let body = document.body;
  let backdrop = document.querySelector('.modal-backdrop');
  body.classList.remove('modal-open');
  backdrop.classList.remove('show');
  backdrop.classList.add('hide');
  modal.classList.remove('show');
  modal.style.display = '';
}
