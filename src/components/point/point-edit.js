import AbstractSmartComponent from "../abstract-smart-component.js";
import flatpickr from "flatpickr";
import {eventActionMap, TRANSFER_TYPES, ACTIVITY_TYPES} from "../../utils/const.js";
import {formatEventEditDate, capitalize} from "../../utils/common.js";
import {Mode} from "../../controllers/point-controller.js";
import {encode} from "he";
import "flatpickr/dist/flatpickr.min.css";

const TEXT_ERROR_END_TIME_VALIDITY = `Дата прибития меньше даты начала`;

const DefaultData = {
  DELETE_BUTTON_TEXT: `Delete`,
  SAVE_BUTTON_TEXT: `Save`,
};

export default class PointEdit extends AbstractSmartComponent {
  constructor(point, mode, pointsModel) {
    const {id, type, eventPrice, startDate, endDate, destination, offers, isFavorite} = point;
    super();
    this._id = id;
    this._externalData = DefaultData;
    this._pointsModel = pointsModel;
    this._offersByType = pointsModel.getOffersbyType(type);
    this._mode = mode;
    this._point = point;
    this._type = type;
    this._eventPrice = eventPrice;
    this._eventStart = formatEventEditDate(startDate);
    this._eventEnd = formatEventEditDate(endDate);
    this._destination = destination === `` ? `` : destination.name;
    this._destinationInfo = destination.description;
    this._chekedOffers = offers;
    this._destinationPhoto = destination.pictures;
    this._action = eventActionMap[type];
    this._isFavorite = isFavorite;
    this._saveButtonHandler = null;
    this._favoriteButtonHandler = null;
    this.subscribeOnEvents();
    this._flatpickr = null;
    this._applyFlatpickr();
    this._deleteButtonClickHandler = null;
  }

  getTemplate() {
    const deleteButtonText = this._externalData.DELETE_BUTTON_TEXT;
    const saveButtonText = this._externalData.SAVE_BUTTON_TEXT;
    const destinationsCities = (this._pointsModel.getDestinations()).map((it) => it.name);

    return (
      `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${TRANSFER_TYPES.map((type) => this._createTypeMarkup(type, this._type)).join(`\n`)}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${ACTIVITY_TYPES.map((type) => this._createTypeMarkup(type, this._type)).join(`\n`)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${capitalize(this._type)} ${this._action}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text"
           name="event-destination" value="${this._destination}" list="destination-list-1" required>
          <datalist id="destination-list-1">
          ${destinationsCities.map(this._createdDestinationMarkup).join(`\n`)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._eventStart}" required>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._eventEnd}" required>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._eventPrice}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
        <button class="event__reset-btn" type="reset">${this._mode !== Mode.ADDING ? `${deleteButtonText}` : `Cancel`}</button>
        ${this._mode !== Mode.ADDING ? this._createFavoriteButton() : ``}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">

          ${this._offersByType !== null ? this._offersByType.map((offer) => this._createOfferMarkup(offer, this._chekedOffers)).join(`\n`) : ``}
          </div>
        </section>
        ${this._destination === `` ? `` :
        `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._destinationInfo}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${this._destinationPhoto === `` ? `` : this._destinationPhoto.map(this._createPhotoMarkup).join(`\n`)}

            </div>
          </div>
        </section>
      </section>`}
    </form>`
    );

  }

  getData() {
    const form = this.getElement();
    return new FormData(form);
  }

  getId() {
    return this._id;
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setDisableForm(isDisable = false) {
    if (isDisable) {
      this.getElement().querySelectorAll(`fieldset, input, button`)
        .forEach((formElement) => formElement.setAttribute(`disabled`, `true`));
    } else {
      document.querySelectorAll(`fieldset, button`)
        .forEach((formElement) => formElement.setAttribute(`disabled`, `false`));
    }
  }

  subscribeOnEvents() {
    const destinationsCities = (this._pointsModel.getDestinations()).map((destinaition) => destinaition.name);
    const deststinations = this._pointsModel.getDestinations();
    const element = this.getElement();
    const eventTypeList = element.querySelector(`.event__type-list`);
    const destinationsListInput = element.querySelector(`#event-destination-1`);
    const eventPriceInput = element.querySelector(`#event-price-1`);
    const validityStartTimeInput = this.getElement().querySelector(`#event-start-time-1`);
    const validityEndTimeInput = this.getElement().querySelector(`#event-end-time-1`);
    const favoriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);


    eventTypeList.addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._type = evt.target.value;
      this._offersByType = this._pointsModel.getOffersbyType(this._type);
      this._action = eventActionMap[this._type];
      this.rerender();
    });

    if (favoriteButton) {
      favoriteButton.addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;
        this.rerender();
      });
    }

    destinationsListInput.addEventListener(`change`, (evt) => {
      evt.preventDefault();

      const index = deststinations.findIndex((destination) => destination.name === evt.target.value);
      if (index === -1) {
        return;
      }

      this._destinationInfo = deststinations[index].description;
      this._destination = deststinations[index].name;
      this._destinationPhoto = deststinations[index].pictures;
      this.rerender();
    });

    destinationsListInput.addEventListener(`input`, () => {
      const isValueCurrent = destinationsCities.includes(destinationsListInput.value);
      if (!isValueCurrent) {
        destinationsListInput.value = ``;
      }
    });

    eventPriceInput.addEventListener(`keyup`, () => {
      eventPriceInput.value = eventPriceInput.value.replace(/[^\d]/g, ``);
      this._eventPrice = encode(eventPriceInput.value);
    });

    validityEndTimeInput.addEventListener(`change`, () => {
      if (validityEndTimeInput) {
        if (validityEndTimeInput.value < validityStartTimeInput.value) {
          validityEndTimeInput.setCustomValidity(TEXT_ERROR_END_TIME_VALIDITY);
          validityEndTimeInput.reportValidity();
        } else {
          validityEndTimeInput.setCustomValidity(``);
        }
      }
    });

    validityStartTimeInput.addEventListener(`change`, () => {
      if (validityStartTimeInput) {
        if (validityEndTimeInput.value < validityStartTimeInput.value) {
          validityStartTimeInput.setCustomValidity(TEXT_ERROR_END_TIME_VALIDITY);
          validityStartTimeInput.reportValidity();
        } else {
          validityStartTimeInput.setCustomValidity(``);
        }
      }
    });
  }

  recoveryListeners() {
    this.setSaveButtonHandler(this._saveButtonHandler);
    this.setFavoriteButtonClickHandler(this._favoriteButtonHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    super.removeElement();
  }

  reset() {
    const point = this._point;
    this._destination = point.destination.name;
    this._destinationInfo = point.destination.description;
    this._offers = point.offers;
    this._type = point.type;
    this._action = eventActionMap[point.type];
    this.rerender();
  }

  _createTypeMarkup(type, currentType) {

    const isChecked = (type === currentType) ? `checked` : ``;

    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden"
         type="radio" name="event-type" value="${type}"${isChecked}>
        <label class="event__type-label  event__type-label--${type}"
         for="event-type-${type}-1">${capitalize(type)}</label>
      </div>`
    );
  }

  _createdDestinationMarkup(city) {
    return (
      `<option value="${city}"></option>`
    );
  }

  _createOfferMarkup(offerByType, checkedOffers) {
    const getCheckedStatus = () => {
      if (checkedOffers !== null) {
        return checkedOffers.some((offer) => offer.title === offerByType.title);
      }
      return false;
    };

    const isChecked = getCheckedStatus();

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offerByType.title}-1"
        type="checkbox" name="event-offer" value="${offerByType.title}" ${isChecked ? `checked` : ``} >
        <label class="event__offer-label" for="event-offer-${offerByType.title}-1">
        <span class="event__offer-title">${offerByType.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offerByType.price}</span>
      </label>
    </div>`
    );
  }

  _createPhotoMarkup(photo) {
    return (
      `<img class="event__photo" src="${photo.src}" alt="Event photo">`
    );
  }

  _createFavoriteButton() {
    return (
      `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${this._isFavorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>`);
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateStartInput = this.getElement().querySelector(`#event-start-time-1`);
    const dateEndInput = this.getElement().querySelector(`#event-end-time-1`);

    const setFormateFormDate = (input) => {
      this._flatpickr = flatpickr(input, {
        allowInput: true,
        enableTime: true,
        dateFormat: `d-m-y H:i`,
      });
    };

    setFormateFormDate(dateStartInput);
    setFormateFormDate(dateEndInput);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  setSaveButtonHandler(handler) {
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, handler);
    this._saveButtonHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    const favoriteButton = this.getElement().querySelector(`.event__favorite-checkbox`);
    if (favoriteButton) {
      favoriteButton.addEventListener(`click`, handler);
    }
    this._favoriteButtonHandler = handler;
  }
}
