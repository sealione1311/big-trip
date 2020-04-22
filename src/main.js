import {createTripCost} from "./components/trip-cost.js";
import {createTripInfo} from "./components/trip-info.js";
import {createSiteMenu} from "./components/site-menu.js";
import {createFilter} from "./components/filter.js";
import {createSortEvents} from "./components/sort.js";
import {createPointEditForm} from "./components/point-edit.js";
import {createTripDay} from "./components/trip-day.js";
import {createTripPointsList} from "./components/trip-list.js";
import {createTripPoint} from "./components/trip-point.js";
import {generatePoints} from "./mocks/points.js";
import {renderSegment} from "./utils/dom-utils.js";

const POINT_COUNT = 20;
const FILTERS = [`everything`, `future`, `past`];
const SORTTYPES = [`event`, `time`, `price`];
const mainContainer = document.querySelector(`.trip-main`);
const filterContainer = mainContainer.querySelector(`.trip-controls`);
const menuContainer = filterContainer.querySelector(`h2`);
const pointsContainer = document.querySelector(`.trip-events`);
const points = generatePoints(POINT_COUNT);
const tripCost = points.reduce((total, point) => total + point.eventPrice, 0);
const sortedPoints = points.sort((a, b) => a.startDate - b.startDate).map((it)=> it.startDate.toDateString());
const countDays = [...new Set(sortedPoints)];

renderSegment(mainContainer, createTripCost(tripCost), `afterBegin`);
const infoContainer = document.querySelector(`.trip-info`);
renderSegment(infoContainer, createTripInfo(sortedPoints[0], sortedPoints[sortedPoints.length - 1]), `afterBegin`);
renderSegment(menuContainer, createSiteMenu(), `afterEnd`);
renderSegment(filterContainer, createFilter(FILTERS));
renderSegment(pointsContainer, createSortEvents(SORTTYPES), `afterBegin`);
renderSegment(pointsContainer, createPointEditForm(points[0]));
renderSegment(pointsContainer, createTripDay(countDays));
const days = document.querySelectorAll(`.day`);

days.forEach((day) => {
  renderSegment(day, createTripPointsList());
  const dayDateElement = day.querySelector(`.day__date`);
  const dateTime = new Date(dayDateElement.dateTime);
  const pointsListContainer = day.querySelector(`.trip-events__list`);
  for (let point of points) {
    if (point.startDate.getDate() === dateTime.getDate()) {
      renderSegment(pointsListContainer, createTripPoint(point));
    }
  }
});


