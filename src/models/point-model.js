export default class PointModel {
  constructor(point) {
    this.id = point.id;
    this.type = point.type;
    this.destination = point.destination;
    this.pointPrice = point[`base_price`];
    this.startDate = new Date(point[`date_from`]);
    this.endDate = new Date(point[`date_to`]);
    this.offers = point[`offers`];
    this.isFavorite = Boolean(point[`is_favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "type": this.type,
      "destination": this.destination,
      "base_price": this.pointPrice,
      "date_from": this.startDate.toJSON(),
      "date_to": this.endDate.toJSON(),
      "offers": this.offers,
      "is_favorite": this.isFavorite,
    };
  }

  static clone(point) {
    return new PointModel(point.toRAW());
  }

  static parsePoint(point) {
    return new PointModel(point);
  }

  static parsePoints(points) {
    return points.map(PointModel.parsePoint);
  }
}
