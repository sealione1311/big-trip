import {getRandomDate, getRandomEndDate, getRandomBoolean, getRandomItem, getRandomIntegerNumber, getRandomArray, getDuration} from "../utils/common.js";
import {TYPE_EVENTS, DESTINATION_CITIES, OFFERS, DESCRIPTION_TEXT} from "../utils/const.js";

const getRandomPictures = () => {
  const photosArray = [];
  const count = getRandomIntegerNumber(3, 5);

  for (let i = 0; i < count; i++) {
    photosArray.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photosArray;
};

const getDestinations = () => {
  return DESTINATION_CITIES.map((city) => {
    return {
      "description": getRandomArray(DESCRIPTION_TEXT),
      "name": city,
      "pictures": getRandomPictures(),
    };
  });
};

export const destinations = getDestinations();

const generatePoint = () => {
  const type = getRandomItem(TYPE_EVENTS);
  const startDate = getRandomDate();
  const endDate = getRandomEndDate(startDate);
  const eventDuration = getDuration(startDate, endDate);
  return {
    id: String(Math.random()),
    type,
    destination: getRandomItem(destinations),
    eventPrice: getRandomIntegerNumber(10, 200),
    startDate,
    endDate,
    eventDuration,
    offers: getRandomBoolean() ? null : getRandomArray(OFFERS[type]),
    isFavorite: false,
  };
};

export const generatePoints = (count) => {
  return new Array(count)
    .fill(``)
    .map(generatePoint);
};
