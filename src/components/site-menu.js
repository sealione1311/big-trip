import AbstractComponent from "./abstract-component.js";

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
          <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
          <a class="trip-tabs__btn" href="#">Stats</a>
      </nav>`
    );
  }

  setActiveMenuItemChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      document.querySelector(`.trip-tabs__btn--active`).classList.remove(`trip-tabs__btn--active`);
      evt.target.classList.add(`trip-tabs__btn--active`);
      const menuItem = evt.target.textContent;
      handler(menuItem);
    });
  }
}
