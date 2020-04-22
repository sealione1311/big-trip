import {formatTime, formatDate} from "../utils/utils.js";
import {MAX_OFFERS_IN_POINT, eventActionMap} from "../utils/const.js";

const createOfferMarkup = (offer) => {
  return (`<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
     </li>`);
};

export const createTripPoint = ({type, destination, eventPrice, startDate, endDate, eventDuration, offers}) => {
  const action = eventActionMap[type];
  const offersMarkup = offers !== null ? offers.slice(0, MAX_OFFERS_IN_POINT).map(createOfferMarkup).join(`\n`) : ``;
  const formatedStartDate = formatDate(startDate);
  const formatedEndDate = formatDate(endDate);
  const timeStart = formatTime(startDate);
  const timeEnd = formatTime(endDate);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${action} ${destination}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatedStartDate}T${timeStart}">${timeStart}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatedEndDate}T${timeEnd}">${timeEnd}</time>
          </p>
          <p class="event__duration">${eventDuration}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${eventPrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};
