const TYPE_EVENTS = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`];
const DESTINATION_CITIES = [`Amsterdam`, `Chamonix`, `Geneva`, `Saint-Petersburg`];
const MAX_NUMBER_RANDOM_DAYS = 3;
const MAX_NUMBER_RANDOM_HOURS = 12;
const MAX_NUMBER_RANDOM_MINUTS = 59;
const MAX_OFFERS_IN_POINT = 3;

const eventActionMap = {
  'taxi': `to`,
  'bus': `to`,
  'train': `to`,
  'ship': `to`,
  'transport': `to`,
  'drive': `to`,
  'flight': `to`,
  'check-in': `in`,
  'sightseeing': `in`,
  'restaurant': `in `
};

const OFFERS = {
  "taxi": [{
    id: `uber`,
    title: `Order Uber`,
    price: 20,
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100,
  }],
  "bus": [{
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }, {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  }],
  "train": [{
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }, {
    id: `meal`,
    title: `Add meal`,
    price: 15
  }, {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  }],
  "ship": [{
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }, {
    id: `meal`,
    title: `Add meal`,
    price: 15
  }, {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  }],
  "transport": [{
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }, {
    id: `meal`,
    title: `Add meal`,
    price: 15
  }, {
    id: `seats`,
    title: `Chid seats`,
    price: 5
  }, {
    id: `train`,
    title: `Travel by train`,
    price: 40
  }],
  "drive": [{
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }],
  "flight": [{
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }, {
    id: `meal`,
    title: `Add meal`,
    price: 15
  }, {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  }],
  "check-in": [{
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }, {
    id: `meal`,
    title: `Add meal`,
    price: 15
  }, {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  }],
  "sightseeing": [{
    id: `lunch`,
    title: `Lunch in city`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }, {
    id: `meal`,
    title: `Add meal`,
    price: 15
  }, {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  }, {
    id: `train`,
    title: `Travel by train`,
    price: 40
  }],
  "restaurant": [{
    id: `luggage`,
    title: `Add luggage`,
    price: 30
  }, {
    id: `comfort`,
    title: `Switch to comfort class`,
    price: 100
  }, {
    id: `meal`,
    title: `Add meal`,
    price: 15
  }, {
    id: `seats`,
    title: `Choose seats`,
    price: 5
  }],
};

export const TRANSFER_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
export const ACTIVITY_TYPES = [`check-in`, `sightseeing`, `restaurant`];

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const MenuItem = {
  STATS: `Stats`,
  TABLE: `Table`
};

export const HIDDEN_CLASS = `visually-hidden`;

const DESCRIPTION_TEXT = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];

const MONTHS = [`JAN`, `FEB`, `MAR`, `APR`, `MAY`, `JUN`, `JUL`, `AUG`, `SEP`, `OCT`, `NOV`, `DEC`];

export {TYPE_EVENTS, DESTINATION_CITIES, MAX_NUMBER_RANDOM_DAYS, MAX_NUMBER_RANDOM_HOURS, MAX_NUMBER_RANDOM_MINUTS, MONTHS, eventActionMap, OFFERS, DESCRIPTION_TEXT, MAX_OFFERS_IN_POINT};
