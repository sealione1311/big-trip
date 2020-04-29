import TripCost from "./components/trip-cost.js";
import TripInfo from "./components/trip-info.js";
import SiteMenu from "./components/site-menu.js";
import Filter from "./components/filter.js";
import SortEvents from "./components/sort.js";
import PointEdit from "./components/point-edit.js";
import TripDay from "./components/trip-day.js";
import TripPointsList from "./components/trip-list.js";
import TripPoint from "./components/trip-point.js";
import NoPoints from "./components/no-points.js";
import {generatePoints} from "./mocks/points.js";
import {render, RenderPosition} from "./utils/dom-utils.js";

const POINT_COUNT = 0;
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

const renderPoint = (container, point) => {
  const replaceTaskToEdit = () => {
    container.replaceChild(pointEditComponent.getElement(), pointComponent.getElement());
  };

  const replaceEditToTask = () => {
    container.replaceChild(pointComponent.getElement(), pointEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const pointComponent = new TripPoint(point);

  const rollupButton = pointComponent.getElement().querySelector(`.event__rollup-btn`);
  rollupButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const pointEditComponent = new PointEdit(point);

  const saveForm = pointEditComponent.getElement().querySelector(`.event__save-btn`);
  saveForm.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(container, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderDaysandPoints = (pointsData) => {
  const days = document.querySelectorAll(`.day`);
  if (days.length === 0) {
    render(pointsContainer, new NoPoints().getElement(), RenderPosition.BEFOREEND);
  } else {
    render(infoContainer, new TripInfo(sortedPoints[0], sortedPoints[sortedPoints.length - 1]).getElement(), RenderPosition.AFTERBEGIN);
    days.forEach((day) => {
      render(day, new TripPointsList().getElement(), RenderPosition.BEFOREEND);
      const dayDateElement = day.querySelector(`.day__date`);
      const dayDate = new Date(dayDateElement.dateTime);
      const pointsListContainer = day.querySelector(`.trip-events__list`);
      for (let point of pointsData) {
        if (point.startDate.getDate() === dayDate.getDate()) {
          renderPoint(pointsListContainer, point);
        }
      }
    });
  }
};

render(mainContainer, new TripCost(tripCost).getElement(), RenderPosition.AFTERBEGIN);
render(menuContainer, new SiteMenu().getElement(), RenderPosition.AFTEREND);
render(filterContainer, new Filter(FILTERS).getElement(), RenderPosition.BEFOREEND);
const infoContainer = document.querySelector(`.trip-info`);
render(pointsContainer, new SortEvents(SORTTYPES).getElement(), RenderPosition.AFTERBEGIN);
render(pointsContainer, new TripDay(countDays).getElement(), RenderPosition.BEFOREEND);
renderDaysandPoints(points);
