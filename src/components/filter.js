import {createElement} from "../utils/dom-utils.js";

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return (
      `<form class="trip-filters" action="#" method="get">
        ${this._filters.map((it, index) => this._renderFilter(it, index === 0)).join(`\n`)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    ).trim();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  _renderFilter(filter, isChecked) {
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden"
         type="radio" name="trip-filter" value="${filter}" ${isChecked ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
      </div>`
    ).trim();
  }

  removeElement() {
    this._element = null;
  }
}
