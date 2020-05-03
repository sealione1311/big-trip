import AbstractComponent from "./abstract-component.js";
import {MONTHS} from "../utils/const.js";
import {castDateTimeFormat} from "../utils/common.js";

export default class TripDay extends AbstractComponent {
  constructor(dates) {
    super();
    this._dates = dates;
    this._isSort = dates === null;
  }

  getTemplate() {
    return (
      `<ul class="trip-days">
        ${this._isSort ? this._createSortMurkup() : this._dates.map((date, index) => this._createTripDay(date, index)).join(`\n`)}
      </ul>`
    );
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
          <ul class="trip-events__list">
          </ul>
      </li>`
    );
  }

  _createSortMurkup() {
    return (
      ` <li class="trip-days__item  day">
          <div class="day__info"></div>
          <ul class="trip-events__list"></ul>
      </li>`
    );
  }
}
