import {FilterType} from "./const.js";
import moment from "moment";

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

const getFuturePoints = (points, nowDate) => {
  return points.filter((point) => isFuture(point.startDate, nowDate));
};

const getPastPoints = (points, nowDate) => {
  return points.filter((point) => isPast(point.startDate, nowDate));
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();
  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }
  return points;
};
