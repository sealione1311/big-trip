import {MONTHS, DESTINATION_CITIES} from "../utils/const.js";
import {createElement} from "../utils/dom-utils.js";

export default class TripInfo {
  constructor(startDate, endDate) {
    this._startDate = startDate;
    this._endDate = endDate;
    this._startDay = new Date(this._startDate);
    this._firstDay = this._startDay.getDate();
    this._month = this._startDay.getMonth();
    this._endDay = new Date(this._endDate);
    this._lastDay = this._endDay.getDate();
    this._citiesInfo = DESTINATION_CITIES.slice(0, 3).join(`-`);
    this._element = null;
  }

  getTemplate() {
    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${this._citiesInfo}</h1>
        <p class="trip-info__dates">${MONTHS[this._month]} ${this._firstDay}&nbsp;&mdash;&nbsp;${this._lastDay}</p>
      </div>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
