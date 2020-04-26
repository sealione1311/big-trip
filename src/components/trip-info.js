import {MONTHS, DESTINATION_CITIES} from "../utils/const.js";
import {createElement} from "../utils/dom-utils.js";

const createTripInfo = (startDate, endDate) => {
  const citiesInfo = DESTINATION_CITIES.join(`-`);
  const startDay = new Date(startDate);
  const firstDay = startDay.getDate();
  const month = startDay.getMonth();
  const endDay = new Date(endDate);
  const lastDay = endDay.getDate();

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${citiesInfo}</h1>
      <p class="trip-info__dates">${MONTHS[month]} ${firstDay}&nbsp;&mdash;&nbsp;${lastDay}</p>
    </div>`
  );
};

export default class TripInfo {
  constructor(startDate, endDate) {
    this._startDate = startDate;
    this._endDate = endDate;
    this._element = null;
  }

  getTemplate() {
    return createTripInfo(this._startDate, this._endDate);
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
