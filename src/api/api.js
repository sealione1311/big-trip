import PointModel from "../models/point-model.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const Code = {
  SUCCESS: 200,
  REDIRECTION: 300
};

const Url = {
  POINTS: `points`,
  DESTINATIONS: `destinations`,
  OFFERS: `offers`
};

const checkStatus = (response) => {
  if (response.status >= Code.SUCCESS && response.status < Code.REDIRECTION) {
    return response;
  }
  throw new Error(`${response.status}: ${response.statusText}`);
};

export default class API {
  constructor(authorization, endPoint) {
    this._authorization = authorization;
    this._endPoint = endPoint;
  }

  getPoints() {
    return this._load({url: Url.POINTS})
    .then(checkStatus)
    .then((response) => response.json())
    .then(PointModel.parsePoints);
  }

  getOffers() {
    return this._load({url: Url.OFFERS})
      .then((response) => response.json());
  }

  getDestinations() {
    return this._load({url: Url.DESTINATIONS})
      .then((response) => response.json());
  }

  createPoint(point) {
    return this._load({
      url: Url.POINTS,
      method: Method.POST,
      body: JSON.stringify(point.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parsePoint);
  }

  updatePoint(id, data) {
    return this._load({
      url: `${Url.POINTS}/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(PointModel.parsePoint);
  }

  deletePoint(id) {
    return this._load({url: `${Url.POINTS}/${id}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

}


