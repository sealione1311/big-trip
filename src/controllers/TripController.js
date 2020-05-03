import NoPoints from "../components/no-points.js";
import PointEdit from "../components/point-edit.js";
import TripPoint from "../components/trip-point.js";
import TripDay from "../components/trip-day.js";
import SortEvents from "../components/sort.js";
import {render, replace, RenderPosition} from "../utils/dom-utils.js";
import {getDurationinMs} from "../utils/common.js";
import {SortType} from "../components/sort.js";
import {sortedDatePoints} from "../main.js";

export default class TripController {
  constructor() {
    this._sortEvents = new SortEvents();
  }

  render(pointsData) {
    const countDays = [...new Set(sortedDatePoints)];
    const pointsContainer = document.querySelector(`.trip-events`);

    const renderPointsinDay = (day) => {
      const dayDateElement = day.querySelector(`.day__date`);
      const dayDate = new Date(dayDateElement.dateTime);
      const pointsListContainer = day.querySelector(`.trip-events__list`);
      for (let point of pointsData) {
        if (point.startDate.getDate() === dayDate.getDate()) {
          this._renderPoint(pointsListContainer, point);
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
        this._renderPoint(pointsListContainer, point);
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

  _renderPoint(container, point) {
    const replaceTaskToEdit = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceEditToTask = () => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        replaceEditToTask();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const pointComponent = new TripPoint(point);


    pointComponent.setClickHandler(() => {
      replaceTaskToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    const pointEditComponent = new PointEdit(point);

    pointEditComponent.setonSaveButtonHandler((evt) => {
      evt.preventDefault();
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(container, pointComponent);
  }

  _checkPointsLength(pointsData) {
    const pointsContainer = document.querySelector(`.trip-events`);
    if (pointsData.length === 0) {
      render(pointsContainer, new NoPoints());
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
}
