import API from "./api/api.js";
import FilterController from "./controllers/filter-controller.js";
import Loading from "./preloaders/loading.js";
import PointsModel from "./models/points-model.js";
import SiteMenu from "./components/site-menu.js";
import Statistics from "./components/statistics.js";
import TripCost from "./components/trip-cost.js";
import TripController from "./controllers/trip-controller.js";
import {render, RenderPosition, remove} from "./utils/dom-utils.js";
import {MenuItem} from "./utils/const.js";

const AUTHORIZATION = `Basic wmlafpoRyDLjuhtGkgL`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const mainContainer = document.querySelector(`.trip-main`);
const filterContainer = mainContainer.querySelector(`.trip-controls`);
const menuContainer = filterContainer.querySelector(`h2`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);
const pointsContainer = document.querySelector(`.trip-events`);
const newPointButton = document.querySelector(`.trip-main__event-add-btn`);

const pointsModel = new PointsModel();
const api = new API(AUTHORIZATION, END_POINT);
const loading = new Loading();
const siteComponent = new SiteMenu();
const statistics = new Statistics(pointsModel);
render(pointsContainer, loading);
render(menuContainer, siteComponent, RenderPosition.AFTEREND);
const filterController = new FilterController(filterContainer, pointsModel);
const tripController = new TripController(pointsModel, pointsContainer, api);

Promise.all([
  api.getPoints(),
  api.getOffers(),
  api.getDestinations()
])
.then(([points, offers, destinations]) => {
  pointsModel.setPoints(points);
  pointsModel.setOffers(offers);
  pointsModel.setDestinations(destinations);
  render(mainContainer, new TripCost(points), RenderPosition.AFTERBEGIN);
  filterController.render();
  tripController.render();
  remove(loading);
})
.catch(() => {
  loading.hide();
  loading.setErrorMessage();
});

render(pageBodyContainer, statistics);
statistics.hide();

siteComponent.setActiveMenuItemChangeHandler((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      filterController.reset();
      tripController.hide();
      statistics.show();
      break;
    case MenuItem.TABLE:
      statistics.hide();
      tripController.show();
      break;
  }
});

newPointButton.addEventListener(`click`, () => {
  filterController.reset();
  tripController.createPoint();
  newPointButton.setAttribute(`disabled`, `true`);
});
