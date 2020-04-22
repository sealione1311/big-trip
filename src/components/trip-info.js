import {MONTHS, DESTINATION_CITIES} from "../utils/const.js";
export const createTripInfo = (startDate, endDate) => {
  const citiesInfo = DESTINATION_CITIES.join(`-`);
  const startDay = new Date(startDate);
  const firstDay = startDay.getDate();
  const month = startDay.getMonth();
  const endDay = new Date(endDate);
  const lastDay = endDay.getDate();
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${citiesInfo}</h1>
      <p class="trip-info__dates">${MONTHS[month]} ${firstDay}&nbsp;&mdash;&nbsp;${lastDay}</p>
    </div>`
  );
};
