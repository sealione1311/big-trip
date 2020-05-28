import AbstractComponent from "./abstract-component.js";


export default class TripCost extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    const tripCost = this._calcTotalPrice(this._points);
    return (
      `<section class="trip-main__trip-info  trip-info">
        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
        </p>
      </section>`
    );
  }

  _calcTotalPrice(points) {
    return points
    .reduce(((total, pointsItems) => (total += pointsItems[`offers`]
      .reduce(((itemsPrice, pointsItem) => (itemsPrice += pointsItem.price)), 0))), 0);
  }
}

