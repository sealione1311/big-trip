import {FilterType} from "./const.js";
import {isFuture, isPast} from "./common.js";

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
