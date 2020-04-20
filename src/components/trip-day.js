import {MONTHS} from "../utils/const.js";
export const createTripDay = (tripDaysDates) => {

  return tripDaysDates.map((date, index) => {
    const dateDay = new Date(date);
    const day = dateDay.getDate();
    const month = dateDay.getMonth();
    const year = dateDay.getYear();

    return (
      ` <li class="trip-days__item  day">
          <div class="day__info">
            <span class="day__counter">${index + 1}</span>
            <time class="day__date" datetime="${year}-${month + 1}-${day}">${MONTHS[month]} ${day}</time>
          </div>
        </li>`
    );
  }).join(`\n`);
};

