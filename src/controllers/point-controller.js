import flatpickr from "flatpickr";
import PointEdit from "../components/point/point-edit.js";
import PointModel from "../models/point-model.js";
import TripPoint from "../components/point/trip-point.js";
import {render, replace, remove, RenderPosition} from "../utils/dom-utils.js";
import {Key} from "../utils/const.js";

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

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  render(point, mode) {
    const allOffers = this._pointsModel.getOffers();
    const allDestinations = this._pointsModel.getDestinations();
    const oldPointComponent = this._tripPoint;
    const oldPointEditComponent = this._pointEdit;
    this._tripPoint = new TripPoint(point);
    this._pointEdit = new PointEdit(point, mode, this._pointsModel);
    this._mode = mode;

    this._tripPoint.setClickHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEdit.setSaveButtonHandler((evt) => {
      evt.preventDefault();
      const formData = this._pointEdit.getData();
      const newPoint = this._parseFormData(formData, allOffers, allDestinations);

      this._pointEdit.setData({
        SAVE_BUTTON_TEXT: `Saving...`,
      });
      this._pointEdit.setDisableForm(true);
      newPoint.id = this._pointEdit.getId();
      this._onDataChange(this, point, newPoint);

      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._pointEdit.setFavoriteButtonClickHandler(() => {
      const clonePoint = PointModel.clone(point);
      clonePoint.isFavorite = !clonePoint.isFavorite;
      this._onDataChange(this, point, clonePoint, true);
    });

    this._pointEdit.setDeleteButtonClickHandler(() => {
      this._pointEdit.setData({
        DELETE_BUTTON_TEXT: `Deleting...`,
      });
      this._onDataChange(this, point, null);
    });

    this._pointEdit.setRollUpButtonHandler(() => {
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
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
        render(this._container, this._pointEdit, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  activateForm() {
    this._pointEdit.setDisableForm(false);
    this._pointEdit.setData({
      SAVE_BUTTON_TEXT: `Save`,
      DELETE_BUTTON_TEXT: `Delete`,
    });
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

  _parseFormData(formData, allOffers, allDestinations) {
    const type = formData.get(`event-type`);
    const startDate = flatpickr.parseDate(formData.get(`event-start-time`), `d/m/y H:i`);
    const endDate = flatpickr.parseDate(formData.get(`event-end-time`), `d/m/y H:i`);
    const offersByType = allOffers.find((offer) => offer.type === type).offers;
    const offersFromForm = formData.getAll(`event-offer`);
    const checkedOffers = offersByType.filter((offer) => offersFromForm.some((formOffer) => offer.title === formOffer));
    const city = formData.get(`event-destination`);
    const checkedDestination = allDestinations.find((destination)=> destination.name === city);

    return new PointModel({
      "type": type,
      "destination": checkedDestination,
      "base_price": Math.abs(Number(formData.get(`event-price`))),
      "date_from": startDate,
      "date_to": endDate,
      "offers": checkedOffers,
      "is_favorite": Boolean(formData.get(`event-favorite`))
    });
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._pointEdit, this._tripPoint);
    this._mode = Mode.EDIT;
  }

  _replaceEditToPoint() {
    if (this._mode !== Mode.ADDING) {
      this._pointEdit.reset();
    }
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._tripPoint, this._pointEdit);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    if (evt.key === Key.ESC) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
