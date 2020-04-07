import {createTripCost} from "./components/trip-cost.js";
import {createTripInfo} from "./components/trip-info.js";
import {createSiteMenu} from "./components/site-menu.js";
import {createFilter} from "./components/filter.js";
import {createSortEvents} from "./components/sort-events.js";
import {createNewEventForm} from "./components/new-event.js";
import {createTripDay} from "./components/new-day.js";
import {createTripPointsList} from "./components/points-list.js";
import {createTripPoint} from "./components/trip-point.js";

const POINT_COUNT = 3;
const mainContainer = document.querySelector(`.trip-main`);
const filterContainer = mainContainer.querySelector(`.trip-controls`);
const menuContainer = filterContainer.querySelector(`h2`);
const eventsContainer = document.querySelector(`.trip-events`);

const renderSegment = (container, segment, place = `beforeend`) => {
  container.insertAdjacentHTML(place, segment);
};

const createTripPoints = () => {
  renderSegment(pointsListContainer, createTripPointsList());
  const pointsContainer = eventsContainer.querySelector(`.trip-events__list`);
  for (let i = 0; i < POINT_COUNT; i++) {
    renderSegment(pointsContainer, createTripPoint());
  }
};

renderSegment(mainContainer, createTripCost(), `afterBegin`);
const infoContainer = document.querySelector(`.trip-info`);
renderSegment(infoContainer, createTripInfo(), `afterBegin`);
renderSegment(menuContainer, createSiteMenu(), `afterEnd`);
renderSegment(filterContainer, createFilter());
renderSegment(eventsContainer, createSortEvents(), `afterBegin`);
renderSegment(eventsContainer, createNewEventForm());
renderSegment(eventsContainer, createTripDay());
const pointsListContainer = eventsContainer.querySelector(`.day`);
createTripPoints();
