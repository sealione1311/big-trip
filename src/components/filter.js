const createFilterMarkup = (filter, isChecked) => {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${filter}" class="trip-filters__filter-input  visually-hidden"
       type="radio" name="trip-filter" value="${filter}" ${isChecked ? `checked` : ``}>
      <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
    </div>`
  );
};

export const createFilter = (filters) => {
  const filtersMarkup = filters.map((filter, i) => createFilterMarkup(filter, i === 0)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
    ${filtersMarkup}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
};
