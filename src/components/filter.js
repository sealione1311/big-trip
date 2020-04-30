import AbstractComponent from "./abstract-component.js";

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return (
      `<form class="trip-filters" action="#" method="get">
        ${this._filters.map((it, index) => this._renderFilter(it, index === 0)).join(`\n`)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    ).trim();
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
}
