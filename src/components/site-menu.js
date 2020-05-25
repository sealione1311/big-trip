import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  NEW_TASK: `control__new-task`,
  STATISTICS: `Stats`,
  TASKS: `Table`,
};

export default class SiteMenu extends AbstractComponent {

  getTemplate() {
    return (
      `<nav class="trip-controls__trip-tabs  trip-tabs">
          <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
          <a class="trip-tabs__btn" href="#">Stats</a>
      </nav>`
    );
  }
  setActiveItem(menuItem) {
    const item = this.getElement().querySelector(`.${menuItem}`);

    if (item) {
      item.checked = true;
    }
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuItem = evt.target.value;

      handler(menuItem);
    });
  }
}
