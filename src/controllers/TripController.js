import NoPoints from "../components/no-points.js";
import PointEdit from "../components/point-edit.js";
import TripPointsList from "../components/trip-list.js";
import TripPoint from "../components/trip-point.js";
import {render, replace, RenderPosition} from "../utils/dom-utils.js";

export default class TripController {

  render(pointsData) {
    this._checkPointsLength(pointsData);
    const days = document.querySelectorAll(`.day`);
    days.forEach((day) => {
      render(day, new TripPointsList(), RenderPosition.BEFOREEND);
      const dayDateElement = day.querySelector(`.day__date`);
      const dayDate = new Date(dayDateElement.dateTime);
      const pointsListContainer = day.querySelector(`.trip-events__list`);
      for (let point of pointsData) {
        if (point.startDate.getDate() === dayDate.getDate()) {
          this._renderPoint(pointsListContainer, point);
        }
      }
    });
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

    render(container, pointComponent, RenderPosition.BEFOREEND);
  }

  _checkPointsLength(pointsData) {
    const pointsContainer = document.querySelector(`.trip-events`);
    if (pointsData.length === 0) {
      render(pointsContainer, new NoPoints(), RenderPosition.BEFOREEND);
    }
  }
}
