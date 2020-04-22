
export const createTripCost = (value) => {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${value}</span>
      </p>
    </section>`
  );
};

