import {createElement} from "../utils/dom-utils.js";
import {MONTHS} from "../utils/const.js";
import {castDateTimeFormat} from "../utils/utils.js";

export default class TripDay {
  constructor(dates) {
    this._dates = dates;
    this._element = null;
  }

  getTemplate() {
    return (
      `<ul class="trip-days">
        ${this._dates.map((date, index) => this._createTripDay(date, index)).join(`\n`)}
      </ul>`
    );
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }
  _createTripDay(date, index) {
    const dateDay = new Date(date);
    const day = dateDay.getDate();
    const monthCount = dateDay.getMonth();
    const month = castDateTimeFormat(dateDay.getMonth() + 1);
    const year = dateDay.getFullYear();

    return (
      ` <li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${index + 1}</span>
            <time class="day__date" datetime="${year}-${month}-${day}">${MONTHS[monthCount]} ${day}</time>
          </div>
      </li>`
    );
  }

  removeElement() {
    this._element = null;
  }
}
