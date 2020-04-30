import AbstractComponent from "./abstract-component.js";

export default class TripCost extends AbstractComponent {
  constructor(cost) {
    super();
    this._cost = cost;
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
}

