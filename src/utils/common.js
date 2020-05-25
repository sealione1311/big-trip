import {MAX_NUMBER_RANDOM_DAYS, MAX_NUMBER_RANDOM_HOURS, MAX_NUMBER_RANDOM_MINUTS} from "./const.js";
import moment from "moment";
export const castDateTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const getRandomBoolean = () => {
  return Math.random() > 0.5;
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};
export const formatEventEditDate = (date) => {
  return moment(date).format(`DD-MM-YY HH:mm`);
};

export const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

export const getRandomArray = (array) => {
  const randomArray = array.slice(0, getRandomIntegerNumber(1, 5));
  return randomArray.sort(() => {
    return 0.5 - Math.random();
  });
};

export const getRandomDate = () => {
  const date = new Date();
  const deltaDays = getRandomIntegerNumber(-1, MAX_NUMBER_RANDOM_DAYS);
  const deltaHours = getRandomIntegerNumber(0, MAX_NUMBER_RANDOM_HOURS);
  const deltaMinutes = getRandomIntegerNumber(0, MAX_NUMBER_RANDOM_MINUTS);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + deltaDays, date.getHours() + deltaHours, date.getMinutes() + deltaMinutes);
};

export const getRandomEndDate = (startDate) => {
  const delta = getRandomIntegerNumber(0, 1);
  const deltaHours = getRandomIntegerNumber(0, MAX_NUMBER_RANDOM_HOURS);
  const deltaMinutes = getRandomIntegerNumber(0, MAX_NUMBER_RANDOM_MINUTS);
  return new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + delta, startDate.getHours() + deltaHours, startDate.getMinutes() + deltaMinutes);
};

export const getDuration = (startDate, endDate) => {
  const delta = moment.duration(moment(endDate).diff(moment(startDate)));
  const days = delta.days() < 1 ? `` : `${castDateTimeFormat(delta.days())}D `;
  const hours = delta.hours() < 1 ? `` : `${castDateTimeFormat(delta.hours())}H `;
  const minutes = delta.minutes() < 1 ? `` : `${castDateTimeFormat(delta.minutes())}M`;

  return `${days}${hours}${minutes}`;

};

export const getDurationInMs = (startDate, endDate) => {
  const delta = moment.duration(moment(endDate).diff(moment(startDate)));
  return delta;

};

export const capitalize = (string) => {
  return string[0].toUpperCase() + string.substring(1);
};

export const isFuture = (startDate, dateNow) => {
  const startDatePoint = moment(startDate);
  const now = moment(dateNow);
  return startDatePoint > now;
};

export const isPast = (startDate, dateNow) => {
  const startDatePoint = moment(startDate);
  const now = moment(dateNow);
  return startDatePoint < now;
};

