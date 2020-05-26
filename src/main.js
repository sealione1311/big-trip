import TripCost from "./components/trip-cost.js";
import TripInfo from "./components/trip-info.js";
import SiteMenu from "./components/site-menu.js";
import Statistics from "./components/statistics.js";
import FilterController from "./controllers/filter.js";
import TripController from "./controllers/TripController.js";
import PointsModel from "./models/points.js";
import {generatePoints} from "./mocks/points.js";
import {render, RenderPosition} from "./utils/dom-utils.js";
import {MenuItem} from "./utils/const.js";


const POINT_COUNT = 20;
const mainContainer = document.querySelector(`.trip-main`);
const filterContainer = mainContainer.querySelector(`.trip-controls`);
const menuContainer = filterContainer.querySelector(`h2`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);
const pointsContainer = document.querySelector(`.trip-events`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

const points = generatePoints(POINT_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);
render(mainContainer, new TripCost(points), RenderPosition.AFTERBEGIN);
const siteComponent = new SiteMenu();
render(menuContainer, siteComponent, RenderPosition.AFTEREND);

const infoContainer = document.querySelector(`.trip-info`);


const filterController = new FilterController(filterContainer, pointsModel);
filterController.render();


render(infoContainer, new TripInfo(points), RenderPosition.AFTERBEGIN);


const tripController = new TripController(pointsModel, pointsContainer);
tripController.render();
const statistics = new Statistics(pointsModel);
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

newEventButton.addEventListener(`click`, () => {
  filterController.reset();
  tripController.createPoint();
  newEventButton.setAttribute(`disabled`, `true`);
});

