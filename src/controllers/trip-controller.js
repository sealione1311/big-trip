import NoPoints from "../components/point/no-points.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point-controller.js";
import Sort, {SortType} from "../components/sort.js";
import TripDay from "../components/trip-day.js";
import {render, RenderPosition, remove} from "../utils/dom-utils.js";
import {getDurationInMs, getDateSortedPoints} from "../utils/common.js";
import {HIDDEN_CLASS} from "../utils/const.js";

const newPointButtonElement = document.querySelector(`.trip-main__event-add-btn`);

export default class TripController {
  constructor(pointsModel, pointsContainer, api) {
    this._pointsModel = pointsModel;
    this._pointsAll = [];
    this._points = [];
    this._container = pointsContainer;
    this._sort = new Sort();
    this._noPoints = new NoPoints();
    this._tripDay = new TripDay();
    this._observer = [];
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._creatingPoint = null;
    this._api = api;
    this._sortType = SortType.EVENT;

  }
  setSortType(sortType) {
    this._sortType = sortType;
  }

  render() {
    this._points = this._getSortedPoints(this._pointsModel.getFiltredPoints(), this._sortType);
    this._pointsAll = this._pointsModel.getPoints();

    const renderSortedPoints = (sortedPoints) => {
      this._tripDay = new TripDay(null);
      render(this._container, this._tripDay);
      const dayElement = document.querySelector(`.day`);
      const pointsListElement = dayElement.querySelector(`.trip-events__list`);
      for (const point of sortedPoints) {
        const pointController = new PointController(pointsListElement, this._onDataChange, this._onViewChange, this._pointsModel);
        pointController.render(point, PointControllerMode.DEFAULT, this._pointsModel);
        this._observer.push(pointController);
      }
    };

    if (!this._pointsAll.length) {
      render(this._container, this._noPoints);
      return;
    }

    render(this._container, this._sort, RenderPosition.AFTERBEGIN);


    this._sort.setSortTypeChangeHandler((sortType) => {
      if (this._creatingPoint) {
        this._creatingPoint = null;
        newPointButtonElement.removeAttribute(`disabled`);
      }

      const sortedEvents = this._getSortedPoints(this._pointsModel.getFiltredPoints(), sortType);
      this._removeDays();

      if (sortType === SortType.EVENT) {
        this._renderPointsandDays(sortedEvents);
      } else {
        renderSortedPoints(sortedEvents);
      }
      this.setSortType(sortType);
    });

    if (this._sortType === SortType.EVENT) {
      this._renderPointsandDays(this._points);
    } else {
      renderSortedPoints(this._points);
    }

  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const newPointElement = document.querySelector(`.trip-days`);
    this._onViewChange();
    this._sort.reset();
    remove(this._noPoints);
    if (!this._pointsAll.length) {
      remove(this._sort);
      this._creatingPoint = new PointController(this._container, this._onDataChange, this._onViewChange, this._pointsModel);
    } else {
      this._creatingPoint = new PointController(newPointElement, this._onDataChange, this._onViewChange, this._pointsModel);
    }
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
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
        newPointButtonElement.removeAttribute(`disabled`);

      } else {
        this._api.createPoint(newData)
          .then((newPoint) => {
            this._pointsModel.addPoint(newPoint);
            pointController.render(newPoint, PointControllerMode.ADDING);
            this._observer = [].concat(pointController, this._observer);

            this._updatePoints();
            newPointButtonElement.removeAttribute(`disabled`);

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
    this._tripDay = new TripDay(countDays);
    render(this._container, this._tripDay);
    const daysElement = document.querySelectorAll(`.day`);
    daysElement.forEach((day) => this._renderPointsinDay(day, points));
  }

  _renderPointsinDay(day, points) {
    const dayDateElement = day.querySelector(`.day__date`);
    const dayDate = new Date(dayDateElement.dateTime);
    const pointsListElement = day.querySelector(`.trip-events__list`);
    for (const point of points) {
      if (point.startDate.getDate() === dayDate.getDate()) {
        const pointController = new PointController(pointsListElement, this._onDataChange, this._onViewChange, this._pointsModel);
        pointController.render(point, PointControllerMode.DEFAULT);
        this._observer.push(pointController);
      }
    }
  }

  _removeDays() {
    const daysListElement = document.querySelector(`.trip-days`);
    if (daysListElement) {
      daysListElement.remove();
    }
  }

  _removePoints() {
    this._removeDays();
    this._observer.forEach((pointController) => pointController.destroy());
    this._observer = [];

  }

  _updatePoints() {
    this._removePoints();
    this.render();
  }

  _getSortedPoints(pointsData, sortType) {
    const defaultPoints = pointsData.slice();
    switch (sortType) {
      case SortType.TIME:
        return (defaultPoints.sort((a, b) => getDurationInMs(a.endDate, a.startDate) - getDurationInMs(b.endDate, b.startDate)));

      case SortType.PRICE:
        return (defaultPoints.sort((a, b) => b.pointPrice - a.pointPrice));

      case SortType.EVENT:
        return defaultPoints;
    }
    return defaultPoints;
  }

  _onViewChange() {
    if (this._creatingPoint) {
      this._creatingPoint.destroy();
      this._creatingPoint = null;
      newPointButtonElement.removeAttribute(`disabled`);
    }
    this._observer.forEach((pointController) => pointController.setDefaultView());
  }

  _onFilterChange() {
    if (!this._pointsAll.length) {
      return;
    }
    if (this._creatingPoint) {
      this._creatingPoint = null;
      newPointButtonElement.removeAttribute(`disabled`);
    }
    this.setSortType(SortType.EVENT);
    this._sort.reset();
    this._updatePoints();
  }
}
