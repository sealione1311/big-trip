import {MONTHS, DESTINATION_CITIES} from "../utils/const.js";
import AbstractComponent from "./abstract-component.js";

export default class TripInfo extends AbstractComponent {
  constructor(startDate, endDate) {
    super();
    this._startDate = startDate;
    this._endDate = endDate;
    this._startDay = new Date(this._startDate);
    this._firstDay = this._startDay.getDate();
    this._startMonth = this._startDay.getMonth();
    this._endDay = new Date(this._endDate);
    this._endMonth = this._endDay.getMonth();
    this._lastDay = this._endDay.getDate();
    this._citiesInfo = DESTINATION_CITIES.slice(0, 3).join(`-`);
  }

  getTemplate() {
    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${this._citiesInfo}</h1>
        <p class="trip-info__dates">${MONTHS[this._startMonth]} ${this._firstDay}&nbsp;&mdash;&nbsp;${MONTHS[this._endMonth]} ${this._lastDay}</p>
      </div>`
    );
  }
}
