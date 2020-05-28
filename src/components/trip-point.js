import {formatTime, formatDate, capitalize, getDuration} from "../utils/common.js";
import {MAX_OFFERS_IN_POINT, eventActionMap} from "../utils/const.js";
import AbstractComponent from "./abstract-component.js";

export default class TripPoint extends AbstractComponent {
  constructor({type, destination, eventPrice, startDate, endDate, offers}) {
    super();
    this._type = type;
    this._destination = destination;
    this._eventPrice = eventPrice;
    this._startDate = startDate;
    this._endDate = endDate;
    this._eventDuration = getDuration(startDate, endDate);
    this._offers = offers;
    this._action = eventActionMap[type];
    this._offersMarkup = this._offers !== null ? this._offers.slice(0, MAX_OFFERS_IN_POINT).map(this._createOfferMarkup).join(`\n`) : ``;
    this.formatedStartDate = formatDate(startDate);
    this.formatedEndDate = formatDate(endDate);
    this.timeStart = formatTime(startDate);
    this.timeEnd = formatTime(endDate);
    this._element = null;
  }

  getTemplate() {
    return (
      `<li class="trip-events__item">
        <div class="event">
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${this._type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${capitalize(this._type)} ${this._action} ${this._destination.name}</h3>

          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${this.formatedStartDate}T${this.timeStart}">${this.timeStart}</time>
              &mdash;
              <time class="event__end-time" datetime="${this.formatedEndDate}T${this.timeEnd}">${this.timeEnd}</time>
            </p>
            <p class="event__duration">${this._eventDuration}</p>
          </div>

          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${this._eventPrice}</span>
          </p>

          <h4 class="visually-hidden">Offers:</h4>
          <ul class="event__selected-offers">
            ${this._offersMarkup}
          </ul>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>`
    );
  }

  _createOfferMarkup(offer) {
    return (`<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
       </li>`);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, handler);
  }
}
