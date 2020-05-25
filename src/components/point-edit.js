import {DESTINATION_CITIES, eventActionMap, OFFERS, TRANSFER_TYPES, ACTIVITY_TYPES} from "../utils/const.js";
import {formatEventEditDate, getRandomBoolean, capitalize, getDuration} from "../utils/common.js";
import {destinations} from "../mocks/points.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";
import {encode} from "he";
import "flatpickr/dist/flatpickr.min.css";

export default class PointEdit extends AbstractSmartComponent {
  constructor(point) {
    const {type, eventPrice, startDate, endDate, destination, offers, isFavorite} = point;
    super();
    this._point = point;
    this._type = type;
    this._eventPrice = eventPrice;
    this._eventStart = formatEventEditDate(startDate);
    this._eventEnd = formatEventEditDate(endDate);
    this._destination = destination === `` ? `` : destination.name;
    this._destinationInfo = destination.description;
    this._offers = offers;
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
           name="event-destination" value="${this._destination}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${DESTINATION_CITIES.map(this._createdDestinationMarkup).join(`\n`)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${this._eventStart}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${this._eventEnd}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${this._eventPrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        ${this._createFavoriteButton()}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${this._offers !== null ? this._offers.map(this._createOfferMarkup).join(`\n`) : ``}
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

  _createTypeMarkup(type, currentType) {

    const isChecked = (type === currentType) ? `checked` : ``;

    return (
      `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden"
         type="radio" name="event-type" value="${type}"${isChecked}>
        <label class="event__type-label  event__type-label--${type}"
         for="event-type-${type}-1">${type}</label>
      </div>`
    );
  }

  _createdDestinationMarkup(city) {
    return (
      `<option value="${city}"></option>`
    );
  }

  _createOfferMarkup(offer) {

    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
        id="event-offer-${offer.id}-1"
        type="checkbox" name="event-offer-${offer.id}" ${getRandomBoolean() ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${offer.id}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
    );
  }

  _createPhotoMarkup(photo) {
    return (
      `<img class="event__photo" src="${photo}" alt="Event photo">`
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

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  subscribeOnEvents() {
    const element = this.getElement();
    const eventTypeList = element.querySelector(`.event__type-list`);
    const destinationsListInput = element.querySelector(`#event-destination-1`);
    const eventPriceInput = element.querySelector(`#event-price-1`);

    eventTypeList.addEventListener(`change`, (evt) => {
      evt.preventDefault();
      this._type = evt.target.value;
      this._offers = OFFERS[this._type];
      this._action = eventActionMap[this._type];
      this.rerender();
    });

    element.querySelector(`.event__favorite-checkbox`).addEventListener(`click`, () => {
      this._isFavorite = !this._isFavorite;
      this.rerender();
    });

    destinationsListInput.addEventListener(`change`, (evt) => {
      evt.preventDefault();

      const index = destinations.findIndex((destination) => destination.name === evt.target.value);
      if (index === -1) {
        return;
      }

      this._destinationInfo = destinations[index].description;
      this._destination = destinations[index].name;
      this._destinationPhoto = destinations[index].pictures;
      this.rerender();
    });

    destinationsListInput.addEventListener(`input`, () => {
      const isValueCurrent = DESTINATION_CITIES.includes(destinationsListInput.value);
      if (!isValueCurrent) {
        destinationsListInput.value = ``;
      }
    });

    eventPriceInput.addEventListener(`keyup`, () => {
      eventPriceInput.value = eventPriceInput.value.replace(/[^\d]/g, ``);
      this._eventPrice = encode(eventPriceInput.value);
    });
  }

  setSaveButtonHandler(handler) {
    this.getElement().querySelector(`.event__save-btn`).addEventListener(`click`, handler);
    this._saveButtonHandler = handler;
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`click`, handler);
    this._favoriteButtonHandler = handler;
  }

  getData() {

    const form = this.getElement();
    const formData = new FormData(form);
    let offers = Array.from(form.querySelectorAll(`.event__offer-selector`));
    offers = offers.map((offer) => {
      return {
        id: offer.querySelector(`[name^= "event-offer-"]`).name.slice(12),
        title: offer.querySelector(`.event__offer-title`).textContent,
        price: offer.querySelector(`.event__offer-price`).textContent,
      };
    });

    return this._parseFormData(formData, offers);
  }

  _parseFormData(formData, offers) {
    const type = formData.get(`event-type`);
    const startDate = flatpickr.parseDate(formData.get(`event-start-time`), `d/m/y H:i`);
    const endDate = flatpickr.parseDate(formData.get(`event-end-time`), `d/m/y H:i`);
    let photos = Array.from(document.querySelectorAll(`.event__photo`));
    photos = photos.map((photo) => photo.src);
    const descriptionText = document.querySelector(`.event__destination-description`).textContent;
    return {
      type,
      startDate,
      endDate,
      destination: {
        name: formData.get(`event-destination`),
        description: descriptionText,
        pictures: photos,
      },
      offers,
      eventPrice: formData.get(`event-price`),
      eventDuration: getDuration(startDate, endDate),
      isFavorite: formData.get(`event-favorite`)
    };
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
    this._type = point.type;
    this._offers = point.offers;
    this._action = eventActionMap[point.type];
    this.rerender();
  }
}
