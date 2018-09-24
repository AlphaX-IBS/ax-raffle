import moment from "moment";

export function getRemainingTime(dueDate) {
  const remains = {};
  let yay = false;
  const countDownTill = new Date(dueDate);
  const now = new Date();

  // Get the years
  const years = moment(countDownTill).diff(moment(), "years");

  if (years > 0) {
    yay = true;
    remains.years = years;
    // Add years to the date
    now.setMonth(now.getMonth() + years * 12);
  }

  // Get the months
  const months = moment(countDownTill).diff(moment(), "months");
  if (yay) {
    remains.months = months;
  } else if (months > 0) {
    yay = true;
    remains.months = months;
    // Add months to the date
    now.setMonth(now.getMonth() + months);
  }

  const days = moment(countDownTill).diff(now, "days");
  remains.days = days;

  return remains;
}

export function getRemainingDays(dueDate) {
  const countDownTill = new Date(dueDate);
  const now = new Date();
  const remainingDays = moment(countDownTill).diff(now, "days");
  return remainingDays > 0 ? remainingDays : 0;
}

export function getRemainingMinutes(timestamp) {
  const now = Date.now();
  const microSecondsDiff = Math.abs(now - timestamp);
  // Number of milliseconds per day =
  //   24 hrs/day * 60 minutes/hour * 60 seconds/minute * 1000 msecs/second
  const minutesDiff = Math.floor(microSecondsDiff / (1000 * 60 * 60 * 24));
  return minutesDiff > 0 ? minutesDiff : 0;
}

export function getRemainingTimeFromDaysToSeconds(timeInSeconds) {
  let t = timeInSeconds;

  const days = Math.floor(t / 86400);
  t = t - days * 86400;

  const hours = Math.floor(t / 3600);
  t = t - hours * 3600;

  const minutes = Math.floor(t / 60);
  t = t - minutes * 60;

  const seconds = t;

  return {
    days,
    hours,
    minutes,
    seconds
  };
}
