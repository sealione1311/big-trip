const createSortMarkup = (sortType, isChecked) => {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sortType}">
      <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
      value="sort-${sortType}" ${isChecked ? `checked` : ``}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
      ${isChecked ? `` : `<svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
          <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>`}
    </div>`
  );
};
export const createSortEvents = (sortTypes) => {
  const sortMarkup = sortTypes.map((sortType, index) => createSortMarkup(sortType, index === 0)).join(`\n`);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    <span class="trip-sort__item  trip-sort__item--day">Day</span>
    ${sortMarkup}
    <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
  </form>`
  );
};
