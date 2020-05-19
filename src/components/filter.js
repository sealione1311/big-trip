import AbstractComponent from "./abstract-component.js";

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return (
      `<form class="trip-filters" action="#" method="get">
        ${this._filters.map((it) => this._renderFilter(it, it.checked)).join(`\n`)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
    ).trim();
  }

  _renderFilter(filter, isChecked) {
    const {name} = filter;
    return (
      `<div class="trip-filters__filter">
        <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden"
         type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
        <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
      </div>`
    ).trim();
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`mouseup`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }
      const filterName = evt.target.textContent;
      handler(filterName);
    });
  }
}
