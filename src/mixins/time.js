import moment from "moment";
import Vue from "vue";

const nFormat = function(date, layout) {
  if (!layout) {
    layout = "DD/MM/YYYY";
  }
  return moment(date).format(layout);
};
const nTime = function(date, layout) {
  if (!layout) {
    layout = "DD/MM/YYYY H:mm A";
  }
  return moment(date).format(layout);
};
const unixFormat = function(date, layout) {
  if (!layout) {
    layout = "DD/MM/YYYY";
  }
  return moment.unix(date).format(layout);
};
export function backendDate(date, layout) {
  if (!layout) {
    layout = "YYYY-MM-DD";
  }
  return moment(date).format(layout);
}
export const nUnixTime = function(date, layout) {
  if (!layout) {
    layout = "DD/MM/YYYY H:mm A";
  }
  return moment.unix(date).format(layout);
};
export const floatToHour = function(decimalTimeString) {
  let decimalTime = parseFloat(decimalTimeString);
  decimalTime = decimalTime * 60 * 60;
  let hours = Math.floor(decimalTime / (60 * 60));
  decimalTime = decimalTime - hours * 60 * 60;
  let minutes = Math.floor(decimalTime / 60);
  decimalTime = decimalTime - minutes * 60;
  let seconds = Math.round(decimalTime);
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + "." + minutes;
};

export const floatToMinutes = function(decimalTimeString) {
  let decimalTime = parseFloat(decimalTimeString);
  decimalTime = decimalTime * 60 * 60;
  let hours = Math.floor(decimalTime / (60 * 60));
  decimalTime = decimalTime - hours * 60 * 60;
  let minutes = Math.floor(decimalTime / 60);
  decimalTime = decimalTime - minutes * 60;
  let seconds = Math.round(decimalTime);
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (hours === 60) {
    hours = 1;
    return hours + " " + "hour";
  } else {
    return hours + " " + "min";
  }
};
const isToday = function(date) {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // January is 0!
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;

  if (today === date) {
    return true;
  }
};
Vue.mixin({
  methods: {
    backendDate,
    nFormat,
    nTime,
    unixFormat,
    nUnixTime,
    floatToHour,
    floatToMinutes
  }
});
export default {
  name: "nTime",
  floatToHour,
  floatToMinutes,
  isToday,
  nUnixTime,
  backendDate
};
