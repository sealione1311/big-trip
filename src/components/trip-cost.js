import AbstractComponent from "./abstract-component.js";


export default class TripCost extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    const tripCost = this._points.reduce((total, point) => total + point.eventPrice, 0);
    return (
      `<section class="trip-main__trip-info  trip-info">
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
        </p>
      </section>`
    );
  }
}

