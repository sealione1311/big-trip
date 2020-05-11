import PointEdit from "../components/point-edit.js";
import TripPoint from "../components/trip-point.js";
import {render, replace} from "../utils/dom-utils.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
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

  render(point) {
    this._tripPoint = new TripPoint(point);
    this._pointEdit = new PointEdit(point);

    this._tripPoint.setClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEdit.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    render(this._container, this._tripPoint);

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
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

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
