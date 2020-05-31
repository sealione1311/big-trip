import moment from "moment";

export const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const capitalize = (string) => {
  return string[0].toUpperCase() + string.substring(1);
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`YYYY/MM/DD`);
};

export const formatEventEditDate = (date) => {
  return moment(date).format(`DD/MM/YY HH:mm`);
};

export const getDuration = (startDate, endDate) => {
  const delta = moment.duration(moment(endDate).diff(moment(startDate)));
  const days = delta.days() < 1 ? `` : `${castDateTimeFormat(delta.days())}D `;
  const hours = delta.hours() < 1 ? `` : `${castDateTimeFormat(delta.hours())}H `;
  const minutes = delta.minutes() < 1 ? `` : `${castDateTimeFormat(delta.minutes())}M`;
  return `${days}${hours}${minutes}`;
};

export const getChartDuration = (diff) => {
  const delta = moment.duration(diff);
  const days = delta.days() < 1 ? `` : `${castDateTimeFormat(delta.days())}D `;
  const hours = delta.hours() < 1 ? `` : `${castDateTimeFormat(delta.hours())}H `;
  const minutes = delta.minutes() < 1 ? `` : `${castDateTimeFormat(delta.minutes())}M`;
  return `${days}${hours}${minutes}`;
};

export const getDurationInMs = (startDate, endDate) => {
  const delta = moment.duration(moment(endDate).diff(moment(startDate)));
  return delta;
};

export const getDateSortedPoints = (points) => {

  return points.slice().sort((a, b) => a.startDate - b.startDate).map((point)=> point.startDate.toDateString());
};
