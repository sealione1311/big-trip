import API from "./api/api.js";
import TripCost from "./components/trip-cost.js";

import TripInfo from "./components/trip-info.js";
import SiteMenu from "./components/site-menu.js";
import Statistics from "./components/statistics.js";
import FilterController from "./controllers/filter-controller.js";
import TripController from "./controllers/trip-controller.js";
import PointsModel from "./models/points-model.js";
import {render, RenderPosition} from "./utils/dom-utils.js";
import {MenuItem} from "./utils/const.js";

const AUTHORIZATION = `Basic wmlafpoRyDLjuhtGkgL`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;


const mainContainer = document.querySelector(`.trip-main`);
const filterContainer = mainContainer.querySelector(`.trip-controls`);
const menuContainer = filterContainer.querySelector(`h2`);
const pageBodyContainer = document.querySelector(`.page-main .page-body__container`);
const pointsContainer = document.querySelector(`.trip-events`);
const newEventButton = document.querySelector(`.trip-main__event-add-btn`);
const api = new API(AUTHORIZATION, END_POINT);

const siteComponent = new SiteMenu();
render(menuContainer, siteComponent, RenderPosition.AFTEREND);

const infoContainer = document.querySelector(`.trip-info`);


const pointsModel = new PointsModel();
const filterController = new FilterController(filterContainer, pointsModel);
const tripController = new TripController(pointsModel, pointsContainer, api);

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(points);
    api.getOffers()
      .then((offers) => {
        pointsModel.setOffers(offers);
        api.getDestinations()
          .then((destinations) => {
            pointsModel.setDestinations(destinations);
            tripController.render();

          });
      });
  });


filterController.render();


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
  debugger
  filterController.reset();
  tripController.createPoint();
  newEventButton.setAttribute(`disabled`, `true`);
});

