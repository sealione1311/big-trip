import TripCost from "./components/trip-cost.js";
import TripInfo from "./components/trip-info.js";
import SiteMenu from "./components/site-menu.js";
import Filter from "./components/filter.js";
import SortEvents from "./components/sort.js";
import TripController from "./controllers/TripController.js";
import TripDay from "./components/trip-day.js";
import {generatePoints} from "./mocks/points.js";
import {render, RenderPosition} from "./utils/dom-utils.js";

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


render(mainContainer, new TripCost(tripCost), RenderPosition.AFTERBEGIN);
render(menuContainer, new SiteMenu(), RenderPosition.AFTEREND);

const infoContainer = document.querySelector(`.trip-info`);

render(filterContainer, new Filter(FILTERS), RenderPosition.BEFOREEND);
render(pointsContainer, new SortEvents(SORTTYPES), RenderPosition.AFTERBEGIN);
render(pointsContainer, new TripDay(countDays), RenderPosition.BEFOREEND);

if (points.length > 0) {
  render(infoContainer, new TripInfo(sortedPoints[0], sortedPoints[sortedPoints.length - 1]), RenderPosition.AFTERBEGIN);
}

const tripController = new TripController();
tripController.render(points);

