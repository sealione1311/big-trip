import {createElement} from "../utils/dom-utils.js";

export default class TripCost {
  constructor(cost) {
    this._cost = cost;
    this._element = null;
  }

  getTemplate() {
    return (
      `<section class="trip-main__trip-info  trip-info">
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${this._cost}</span>
        </p>
      </section>`
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

