import PointEdit from "../components/point-edit.js";
import TripPoint from "../components/trip-point.js";
import {render, replace, remove} from "../utils/dom-utils.js";
import PointModel from "../models/point-model.js";
import flatpickr from "flatpickr";

const SHAKE_ANIMATION_TIMEOUT = 600;


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

const parseFormData = (formData, allOffers, allDestinations) => {
  const type = formData.get(`event-type`);
  const startDate = flatpickr.parseDate(formData.get(`event-start-time`), `d/m/y H:i`);
  const endDate = flatpickr.parseDate(formData.get(`event-end-time`), `d/m/y H:i`);
  const offersByType = allOffers.find((offer) => offer.type === type).offers;
  const offersFromForm = formData.getAll(`event-offer`);
  const checkedOffers = offersByType.filter((offer) => offersFromForm.some((formOffer) => offer.title === formOffer));
  const city = formData.get(`event-destination`);
  const checkedDestination = allDestinations.find((it)=> it.name === city);

  return new PointModel({
    "type": type,
    "destination": checkedDestination,
    "base_price": Math.abs(Number(formData.get(`event-price`))),
    "date_from": startDate,
    "date_to": endDate,
    "offers": checkedOffers,
    "is_favorite": Boolean(formData.get(`event-favorite`))
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, pointsModel) {
    this._container = container;
    this._tripPoint = null;
    this._pointEdit = null;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._mode = Mode.DEFAULT;
    this._pointsModel = pointsModel;
  }

  render(point, mode) {
    const allOffers = this._pointsModel.getOffers();
    const allDestinations = this._pointsModel.getDestinations();
    const oldPointComponent = this._tripPoint;
    const oldPointEditComponent = this._pointEdit;
    this._tripPoint = new TripPoint(point);
    this._pointEdit = new PointEdit(point, this._mode, this._pointsModel);
    this._mode = mode;

    this._tripPoint.setClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEdit.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      const formData = this._pointEdit.getData();
      const data = parseFormData(formData, allOffers, allDestinations);
      this._pointEdit.setData({
        SAVE_BUTTON_TEXT: `Saving...`,
      });

      data.id = this._pointEdit.getId();
      this._onDataChange(this, point, data);

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });
    this._pointEdit.setFavoriteButtonClickHandler(() => {
      const data = PointModel.clone(point);
      data.isFavorite = !data.isFavorite;
      this._onDataChange(this, point, data, true);
    });

    this._pointEdit.setDeleteButtonClickHandler(() => {
      this._pointEdit.setData({
        DELETE_BUTTON_TEXT: `Deleting...`,
      });
      this._onDataChange(this, point, null);
    });

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

  shake() {
    this._pointEdit.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._tripPoint.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._pointEdit.getElement().style.animation = ``;
      this._tripPoint.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
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
