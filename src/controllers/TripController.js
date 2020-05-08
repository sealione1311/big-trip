import PointController from "../controllers/pointController.js";
import NoPoints from "../components/no-points.js";
import TripDay from "../components/trip-day.js";
import SortEvents from "../components/sort.js";
import {render, RenderPosition} from "../utils/dom-utils.js";
import {getDurationinMs} from "../utils/common.js";
import {SortType} from "../components/sort.js";
import {sortedDatePoints} from "../main.js";

export default class TripController {
  constructor() {
    this._events = [];
    this._sortEvents = new SortEvents();
    this._observer = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  render(pointsData) {
    const countDays = [...new Set(sortedDatePoints)];
    const pointsContainer = document.querySelector(`.trip-events`);
    this._events = pointsData;

    const renderPointsinDay = (day) => {
      const dayDateElement = day.querySelector(`.day__date`);
      const dayDate = new Date(dayDateElement.dateTime);
      const pointsListContainer = day.querySelector(`.trip-events__list`);
      for (let point of this._events) {
        if (point.startDate.getDate() === dayDate.getDate()) {
          const pointController = new PointController(pointsListContainer, this._onDataChange, this._onViewChange);
          pointController.render(point);
          this._observer.push(pointController);
        }
      }
    };

    const renderPointsandDays = () => {
      render(pointsContainer, new TripDay(countDays));
      const days = document.querySelectorAll(`.day`);
      days.forEach(renderPointsinDay);
    };

    const renderSortedPoints = (sortedEvents) => {
      render(pointsContainer, new TripDay(null));
      const day = document.querySelector(`.day`);
      const pointsListContainer = day.querySelector(`.trip-events__list`);
      for (let point of sortedEvents) {
        const pointController = new PointController(pointsListContainer, this._onDataChange);
        pointController.render(point);
        this._showedPointControllers.push(pointController);
      }
    };

    render(pointsContainer, this._sortEvents, RenderPosition.AFTERBEGIN);

    this._sortEvents.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = this._getSortedPoints(pointsData, sortType);
      const daysList = document.querySelector(`.trip-days`);

      daysList.remove();

      if (sortType === SortType.EVENT) {
        renderPointsandDays(sortedEvents);
      } else {
        renderSortedPoints(sortedEvents);
      }
    });

    this._checkPointsLength(pointsData);

    renderPointsandDays();
  }

  _checkPointsLength(pointsData) {
    const pointsContainer = document.querySelector(`.trip-events`);
    if (pointsData.length === 0) {
      render(pointsContainer, new NoPoints());
      return;
    }
  }

  _getSortedPoints(pointsData, sortType) {
    let sortedEvents = [];
    const defaultPoints = pointsData.slice();

    switch (sortType) {
      case SortType.TIME:
        sortedEvents = defaultPoints.sort((a, b) => getDurationinMs(a.endDate, a.startDate) - getDurationinMs(b.endDate, b.startDate));
        break;
      case SortType.PRICE:
        sortedEvents = defaultPoints.sort((a, b) => b.eventPrice - a.eventPrice);
        break;
      case SortType.EVENT:
        sortedEvents = defaultPoints;
        break;
    }
    return sortedEvents;
  }

  _onDataChange(pointController, oldData, newData) {

    const index = (this._events.findIndex((it) => it === oldData));

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index]);

  }

  _onViewChange() {
    this._observer.forEach((pointController) => pointController.setDefaultView());
  }
}
