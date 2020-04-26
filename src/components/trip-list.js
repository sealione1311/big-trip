import {createElement} from "../utils/dom-utils.js";

const createTripPointsList = () => {
  return (
    `<ul class="trip-events__list">
    </ul>`
  );
};

export default class TripList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripPointsList();
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
