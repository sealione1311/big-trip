export const renderSegment = (container, segment, place = `beforeend`) => {
  container.insertAdjacentHTML(place, segment);
};
