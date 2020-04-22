const TYPE_EVENTS = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`];
const DESTINATION_CITIES = [`Amsterdam`, `Chamonix`, `Geneva`, `Saint-Petersburg`];
const MAX_NUMBER_RANDOM_DAYS = 3;
const MAX_NUMBER_RANDOM_HOURS = 12;
const MAX_NUMBER_RANDOM_MINUTS = 59;
const eventActionMap = {
  'Taxi': `to`,
  'Bus': `to`,
  'Train': `to`,
  'Ship': `to`,
  'Transport': `to`,
  'Drive': `to`,
  'Flight': `to`,
  'Check-in': `in`,
  'Sightseeing': `in`,
  'Restaurant': `in `
};
const MAX_OFFERS_IN_POINT = 3;
const OFFERS = [
  {
    title: `Add meal`,
    price: 20,
    id: `meal`,
  },
  {
    title: `Add luggage`,
    price: 30,
    id: `luggage`,
  },
  {
    title: `Switch to comfort`,
    price: 100,
    id: `comfort`,
  },
  {
    title: `Book tickets`,
    price: 50,
    id: `tickets`,
  },
  {
    title: `Lunch in city`,
    price: 40,
    id: `lunch`,
  },
];
const DESCRIPTION_TEXT = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];
const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];
export {TYPE_EVENTS, DESTINATION_CITIES, MAX_NUMBER_RANDOM_DAYS, MAX_NUMBER_RANDOM_HOURS, MAX_NUMBER_RANDOM_MINUTS, MONTHS, eventActionMap, OFFERS, DESCRIPTION_TEXT, MAX_OFFERS_IN_POINT};
