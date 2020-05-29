import AbstractComponent from "../components/abstract-component.js";

export default class Loading extends AbstractComponent {
  getTemplate() {
    return (
      `<p class="trip-events__msg">Loading...</p>`
    );
  }

  setErrorMessage() {
    return (
      `<p class="trip-events__msg">Error load</p>`
    );
  }
}
