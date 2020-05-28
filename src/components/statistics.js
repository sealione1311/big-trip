import AbstractSmartComponent from "./abstract-smart-component.js";
import {ACTIVITY_TYPES} from "../utils/const.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getChartDuration} from "../utils/common.js";
const BAR_HEIGHT = 55;
const MIN_BAR_LENGTH = 50;
const BAR_THICKNESS = 44;
const DATALABELS_SIZE = 13;
const TITLE_FONT_SIZE = 23;
const TICKS_PADDING = 5;
const TICKS_FONT_SIZE = 13;
const LAYOT_PADDING = 30;

const createStatsTemplate = () => {
  return (
    `<section class="statistics">
       <h2 class="visually-hidden">Trip statistics</h2>

       <div class="statistics__item statistics__item--money">
         <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
       </div>

       <div class="statistics__item statistics__item--transport">
         <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
       </div>

       <div class="statistics__item statistics__item--time-spend">
         <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
       </div>
    </section>`
  );
};

const typeSymbols = new Map([
  [`taxi`, `🚕`],
  [`bus`, `🚌`],
  [`train`, `🚂`],
  [`ship`, `🛳`],
  [`transport`, `🚊`],
  [`drive`, `🚗`],
  [`flight`, `✈`],
  [`check-in`, `🏨`],
  [`sightseeing`, `🏛`],
  [`restaurant`, `🍴`]
]);


const createChartTemplate = (ctx, data, formatter, title) => {
  debugger
  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: data.map((it) => {
        return it[0].toUpperCase() + ` ` + typeSymbols.get(it[0]);
      }),
      datasets: [{
        data: data.map((it) => {
          return it[1];
        }),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: BAR_THICKNESS,
        minBarLength: MIN_BAR_LENGTH,
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: DATALABELS_SIZE,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter
        }
      },
      title: {
        display: true,
        text: title.toUpperCase(),
        fontColor: `#000000`,
        fontSize: TITLE_FONT_SIZE,
        position: `left`
      },
      layout: {
        padding: {
          left: LAYOT_PADDING,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: TICKS_PADDING,
            fontSize: TICKS_FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const printMoneyChart = (moneyCtx, data) => {
  const formatValue = (val) => `€ ${val}`;
  createChartTemplate(moneyCtx, data, formatValue, `money`);
};

const printTransportChart = (transportCtx, data) => {
  const formatValue = (val) => `${val}x`;
  createChartTemplate(transportCtx, data, formatValue, `transport`);
};

const printTimeChart = (timeCtx, data) => {
  const formatValue = (val) => `${getChartDuration(val)}`;
  createChartTemplate(timeCtx, data, formatValue, `time spent`);
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  getElement() {
    const element = super.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);
    moneyCtx.height = BAR_HEIGHT * this._getMoneyTotal().length;
    transportCtx.height = BAR_HEIGHT * this._getTransportTotal().length;
    timeSpendCtx.height = BAR_HEIGHT * this._getTimeTotal().length;
    this._moneyChart = printMoneyChart(moneyCtx, this._getMoneyTotal());
    this._transportChart = printTransportChart(transportCtx, this._getTransportTotal());
    this._timeSpendChart = printTimeChart(timeSpendCtx, this._getTimeTotal());
    return element;
  }
  _destroyCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }

  show() {
    super.show();
    this.rerender();
  }

  recoveryListeners() {}

  _getData(cb) {
    const reducer = (sum, event) => {
      const type = event.type;
      if (!sum.has(type)) {
        sum.set(type, 0);
      }
      sum.set(type, sum.get(type) + cb(event));

      if (cb(event) === true) {
        ACTIVITY_TYPES.forEach((it) => {
          sum.delete(it.toString().toLowerCase());
        });
      }

      return sum;
    };
    this._points = this._pointsModel.getPoints();
    return Array.from(this._points.reduce(reducer, new Map())).sort((a, b) => {
      return b[1] - a[1];
    });
  }

  hide() {
    super.hide();
    this._destroyCharts();
  }

  _getMoneyTotal() {
    return this._getData((event) => {
      return +event.eventPrice;
    });
  }

  _getTransportTotal() {
    return this._getData(() => {
      return true;
    });
  }

  _getTimeTotal() {
    return this._getData((event) => {
      return event.endDate - event.startDate;
    });
  }

}
