import PointEdit from "../components/point-edit.js";
import TripPoint from "../components/trip-point.js";
import {render, replace, remove} from "../utils/dom-utils.js";

export const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
  ADDING: `adding`,
};

export const EmptyPoint = {
  type: `bus`,
  destination: ``,
  eventPrice: `0`,
  startDate: new Date(),
  endDate: new Date(),
  eventDuration: ``,
  offers: null,
  isFavorite: false,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._tripPoint = null;
    this._pointEdit = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._mode = Mode.DEFAULT;
  }

  render(point, mode) {

    const oldPointComponent = this._tripPoint;
    const oldPointEditComponent = this._pointEdit;
    this._tripPoint = new TripPoint(point);
    this._pointEdit = new PointEdit(point);
    this._mode = mode;

    this._tripPoint.setClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEdit.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      const data = this._pointEdit.getData();
      this._onDataChange(this, point, data);

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEdit.setDeleteButtonClickHandler(() => this._onDataChange(this, point, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointEditComponent && oldPointComponent) {
          replace(this._tripPoint, oldPointComponent);
          replace(this._pointEdit, oldPointEditComponent);
          this._replaceEditToPoint();
        } else {
          render(this._container, this._tripPoint);
        }
        break;
      case Mode.ADDING:
        if (oldPointEditComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._pointEdit);
        break;
    }
  }

  hide() {
    this._container.classList.add(HIDDEN_CLASS);
  }

  show() {
    this._container.classList.remove(HIDDEN_CLASS);
  }

  destroy() {
    remove(this._pointEdit);
    remove(this._tripPoint);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEdit, this._tripPoint);
    this._mode = Mode.EDIT;
  }

  _replaceEditToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._pointEdit.reset();
    replace(this._tripPoint, this._pointEdit);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape`;

    if (isEscKey) {
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }
}
