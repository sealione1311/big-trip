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

const POINT_COUNT = 20;
const mainContainer = document.querySelector(`.trip-main`);
const filterContainer = mainContainer.querySelector(`.trip-controls`);
const menuContainer = filterContainer.querySelector(`h2`);
const pointsContainer = document.querySelector(`.trip-events`);
const points = generatePoints(POINT_COUNT);

const sortedPoints = points.sort((a, b) => a.startDate - b.startDate).map((it)=> it.startDate.toDateString());
const countDays = Array.from(new Set(sortedPoints));

const renderSegment = (container, segment, place = `beforeend`) => {
  container.insertAdjacentHTML(place, segment);
};

renderSegment(mainContainer, createTripCost(), `afterBegin`);
const infoContainer = document.querySelector(`.trip-info`);
renderSegment(infoContainer, createTripInfo(), `afterBegin`);
renderSegment(menuContainer, createSiteMenu(), `afterEnd`);
renderSegment(filterContainer, createFilter());
renderSegment(pointsContainer, createSortEvents(), `afterBegin`);
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


