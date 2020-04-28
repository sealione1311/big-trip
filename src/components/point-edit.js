import {DESTINATION_CITIES, eventActionMap} from "../utils/const.js";
import {formatEventEditDate, getRandomBoolean} from "../utils/utils.js";
import {createElement} from "../utils/dom-utils.js";

const TRANSFER_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
const ACTIVITY_TYPES = [`Check-in`, `Sightseeing`, `Restaurant`];

export default class PointEdit {
  constructor({type, eventPrice, startDate, endDate, destination, destinationInfo, offers, destinationPhoto}) {
    this._type = type;
    this._eventPrice = eventPrice;
    this._eventStart = formatEventEditDate(startDate);
    this._eventEnd = formatEventEditDate(endDate);
    this._destination = destination;
    this._destinationInfo = destinationInfo;
    this._offers = offers;
    this._destinationPhoto = destinationPhoto;
    this._action = eventActionMap[type];
    this._element = null;
  }

  getTemplate() {
    return (
      `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${this._type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${TRANSFER_TYPES.map(this._createTypeMarkup).join(`\n`)}
            </fieldset>

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${ACTIVITY_TYPES.map(this._createTypeMarkup).join(`\n`)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
          ${this._type} ${this._action}
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
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${this._offers !== null ? this._offers.map(this._createOfferMarkup).join(`\n`) : ``}
          </div>
        </section>

        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${this._destinationInfo}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${this._destinationPhoto.map(this._createPhotoMarkup).join(`\n`)}

            </div>
          </div>
        </section>
      </section>
    </form>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  _createTypeMarkup(type) {
    return (
      `<div class="event__type-item">
        <input id="event-type-${type.toLowerCase()}-1" class="event__type-input  visually-hidden"
         type="radio" name="event-type" value="${type.toLowerCase()}">
        <label class="event__type-label  event__type-label--${type.toLowerCase()}"
         for="event-type-${type.toLowerCase()}-1">${type}</label>
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

  removeElement() {
    this._element = null;
  }
}
