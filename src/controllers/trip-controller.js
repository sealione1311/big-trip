import NoPoints from "../components/point/no-points.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point-controller.js";
import Sort, {SortType} from "../components/sort.js";
import TripDay from "../components/trip-day.js";
import {render, RenderPosition} from "../utils/dom-utils.js";
import {getDurationInMs, getDateSortedPoints} from "../utils/common.js";
import {HIDDEN_CLASS} from "../utils/const.js";

const newEventButton = document.querySelector(`.trip-main__event-add-btn`);

export default class TripController {
  constructor(pointsModel, pointsContainer, api) {
    this._pointsModel = pointsModel;
    this._container = pointsContainer;
    this._events = [];
    this._sortEvents =
    this._sortEvents = new Sort();
    this._observer = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._creatingPoint = null;
    this._api = api;
  }

  render() {
    const points = this._pointsModel.getPoints();
    const renderSortedPoints = (sortedEvents) => {
      render(this._container, new TripDay(null));
      const day = document.querySelector(`.day`);
      const pointsListContainer = day.querySelector(`.trip-events__list`);
      for (const point of sortedEvents) {
        const pointController = new PointController(pointsListContainer, this._onDataChange, this._onViewChange, this._pointsModel);
        pointController.render(point, PointControllerMode.DEFAULT, this._pointsModel);
        this._observer.push(pointController);
      }
    };

    render(this._container, this._sortEvents, RenderPosition.AFTERBEGIN);

    this._sortEvents.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = this._getSortedPoints(points, sortType);
      this._removeDays();
      if (sortType === SortType.EVENT) {
        this._renderPointsandDays(sortedEvents);
      } else {
        renderSortedPoints(sortedEvents);
      }
    });

    if (points.length === 0) {
      render(this._container, new NoPoints());
      return;
    }

    this._renderPointsandDays(points);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    const sortForm = document.querySelector(`.trip-sort`);
    this._onViewChange();
    this._sortEvents.reset();
    this._creatingPoint = new PointController(sortForm, this._onDataChange, this._onViewChange, this._pointsModel);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING, RenderPosition.AFTEREND);
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  _onDataChange(pointController, oldData, newData, isFavoriteUpdate = false) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updatePoints();
        newEventButton.disabled = false;
      } else {
        this._api.createPoint(newData)
          .then((newPoint) => {
            this._pointsModel.addPoint(newPoint);
            pointController.render(newPoint, PointControllerMode.ADDING);
            this._observer = [].concat(pointController, this._observer);
            this._updatePoints();
            this._newEventButton.disabled = false;
          })
          .catch(() => {
            pointController.shake();
            pointController.activateForm();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
          pointController.activateForm();
        });
    } else {

      this._api.updatePoint(oldData.id, newData)
        .then((updetedPoint) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, updetedPoint);

          if (isSuccess) {
            if (isFavoriteUpdate) {
              return;
            }
            pointController.render(updetedPoint, PointControllerMode.DEFAULT);
            this._updatePoints();
          }
        })
        .catch(() => {
          pointController.shake();
          pointController.activateForm();
        });
    }
  }

  _renderPointsandDays(points) {
    const countDays = [...new Set(getDateSortedPoints(points))];
    render(this._container, new TripDay(countDays));
    const days = document.querySelectorAll(`.day`);
    days.forEach((day) => this._renderPointsinDay(day, points));
  }

  _renderPointsinDay(day, points) {
    const dayDateElement = day.querySelector(`.day__date`);
    const dayDate = new Date(dayDateElement.dateTime);
    const pointsListContainer = day.querySelector(`.trip-events__list`);
    for (const point of points) {
      if (point.startDate.getDate() === dayDate.getDate()) {
        const pointController = new PointController(pointsListContainer, this._onDataChange, this._onViewChange, this._pointsModel);
        pointController.render(point, PointControllerMode.DEFAULT);
        this._observer.push(pointController);
      }
    }
  }

  _removeDays() {
    const daysList = document.querySelector(`.trip-days`);
    daysList.remove();
  }

  _removePoints() {
    this._removeDays();
    this._observer.forEach((pointController) => pointController.destroy());
    this._observer = [];
  }

  _updatePoints() {
    this._removePoints();
    this._renderPointsandDays(this._pointsModel.getFiltredPoints());
  }

  _getSortedPoints(pointsData, sortType) {
    let sortedEvents = [];
    const defaultPoints = pointsData.slice();

    switch (sortType) {
      case SortType.TIME:
        sortedEvents = defaultPoints.sort((a, b) => getDurationInMs(a.endDate, a.startDate) - getDurationInMs(b.endDate, b.startDate));
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

  _onViewChange() {
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
      this._newEventButton.disabled = false;
    }
    this._observer.forEach((pointController) => pointController.setDefaultView());
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
