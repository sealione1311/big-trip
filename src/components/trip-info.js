import {MONTHS, DESTINATION_CITIES} from "../utils/const.js";
import {getDateSortedPoints} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";


export default class TripInfo extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
    this._sortedPoints = getDateSortedPoints(this._points);
    this._startDate = this._sortedPoints[0];
    this._endDate = this._points.length > 0 ? this._sortedPoints[this._sortedPoints.length - 1] : ``;
    this._startDay = this._points.length > 0 ? new Date(this._startDate) : ``;
    this._firstDay = this._points.length > 0 ? this._startDay.getDate() : ``;
    this._startMonth = this._points.length > 0 ? this._startDay.getMonth() : ``;
    this._endDay = this._points.length > 0 ? new Date(this._endDate) : ``;
    this._endMonth = this._points.length > 0 ? this._endDay.getMonth() : ``;
    this._lastDay = this._points.length > 0 ? this._endDay.getDate() : ``;
    this._citiesInfo = this._points.length > 0 ? DESTINATION_CITIES.slice(0, 3).join(`-`) : ``;
  }

  getTemplate() {
    return (
      `<div class="trip-info__main">
        <h1 class="trip-info__title">${this._citiesInfo}</h1>
        <p class="trip-info__dates">${this._points.length > 0 ? MONTHS[this._startMonth] : ``}
        ${this._firstDay}${this._points.length > 0 ? `&nbsp;&mdash;&nbsp;` : ``}${this._points.length > 0 ? MONTHS[this._endMonth] : ``} ${this._lastDay}</p>
      </div>`
    );
  }
}
