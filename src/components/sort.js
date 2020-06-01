import AbstractSmartComponent from "./abstract-smart-component.js";

const SORTTYPES = [`event`, `time`, `price`];

export const SortType = {
  EVENT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();
    this._currentSortType = SortType.EVENT;
  }

  getTemplate() {
    return (
      `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>
      ${SORTTYPES.map((sortType) => (this._createSortMarkup(sortType, this._currentSortType === `sort-${sortType}`))).join(`\n`)}
      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
    );
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._sortTypeChangeHandler);
  }

  reset() {
    this._currentSortType = SortType.EVENT;
    super.rerender();
  }

  _createSortMarkup(sortType, isChecked) {
    return (
      `<div class="trip-sort__item  trip-sort__item--${sortType}">
        <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
        value="sort-${sortType}" ${isChecked ? `checked` : ``}>
        <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
        ${isChecked ? `` : `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>`}
      </div>`
    );
  }

  setSortTypeChangeHandler(handler) {

    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.classList.value !== `trip-sort__input  visually-hidden`) {
        return;
      }
      const sortType = evt.target.id;
      if (this._currentSortType === sortType) {
        return;
      }
      this._currentSortType = sortType;
      handler(this._currentSortType);
      this._sortTypeChangeHandler = handler;
    });
  }
}
