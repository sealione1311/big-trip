import TripCost from "./components/trip-cost.js";
import TripInfo from "./components/trip-info.js";
import SiteMenu from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import TripController from "./controllers/TripController.js";
import PointsModel from "./models/points.js";
import {generatePoints} from "./mocks/points.js";
import {render, RenderPosition} from "./utils/dom-utils.js";

const POINT_COUNT = 20;
const mainContainer = document.querySelector(`.trip-main`);
const filterContainer = mainContainer.querySelector(`.trip-controls`);
const menuContainer = filterContainer.querySelector(`h2`);
export const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const points = generatePoints(POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);
const tripCost = points.reduce((total, point) => total + point.eventPrice, 0);
export const sortedDatePoints = points.sort((a, b) => a.startDate - b.startDate).map((it)=> it.startDate.toDateString());

render(mainContainer, new TripCost(tripCost), RenderPosition.AFTERBEGIN);
const siteComponent = new SiteMenu();
render(menuContainer, siteComponent, RenderPosition.AFTEREND);

const infoContainer = document.querySelector(`.trip-info`);


const filterController = new FilterController(filterContainer, pointsModel);
filterController.render();

if (points.length > 0) {
  render(infoContainer, new TripInfo(sortedDatePoints[0], sortedDatePoints[sortedDatePoints.length - 1]), RenderPosition.AFTERBEGIN);
}

const tripController = new TripController(pointsModel);
tripController.render();

newEventButton.addEventListener(`click`, () => {
  filterController.reset();
  tripController.createPoint();
  newEventButton.setAttribute(`disabled`, `true`);
});

