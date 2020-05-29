import AbstractComponent from "./abstract-component.js";


export default class TripCost extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    const tripCost = this._calculateTotalPrice(this._points);
    return (
      `<section class="trip-main__trip-info  trip-info">
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
        </p>
      </section>`
    );
  }

  _calculateOffersPrice(offers) {
    return offers.reduce((total, offer) => total + offer.price, 0);
  }
  _calculateTotalPrice(points) {
    return points.reduce((total, point) => total + point.eventPrice + this._calculateOffersPrice(point.offers), 0);
  }
}
