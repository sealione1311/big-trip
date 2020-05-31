import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ACTIVITY_TYPES} from "../utils/const.js";
import {getChartDuration} from "../utils/common.js";

const ChartTitle = {
  MONEY: `money`,
  TRANSPORT: `transport`,
  TIME_SPEND: `time spent`,
};

const ChartValue = {
  MIN_BAR_LENGTH: 50,
  BAR_THICKNESS: 44,
  DATALABELS_SIZE: 13,
  TITLE_FONT_SIZE: 23,
  TICKS_PADDING: 5,
  TICKS_FONT_SIZE: 13,
  LAYOT_PADDING: 30,
  BAR_HEIGHT: 55,
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

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;
  }

  getTemplate() {
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
  }

  getElement() {
    const element = super.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);
    moneyCtx.height = ChartValue.BAR_HEIGHT * this._getMoneyTotal().length;
    transportCtx.height = ChartValue.BAR_HEIGHT * this._getTransportTotal().length;
    timeSpendCtx.height = ChartValue.BAR_HEIGHT * this._getTimeTotal().length;
    this._moneyChart = this._printMoneyChart(moneyCtx, this._getMoneyTotal());
    this._transportChart = this._printTransportChart(transportCtx, this._getTransportTotal());
    this._timeSpendChart = this._printTimeChart(timeSpendCtx, this._getTimeTotal());
    return element;
  }

  show() {
    super.show();
    this.rerender();
  }

  hide() {
    super.hide();
    this._destroyCharts();
  }

  _createChartTemplate(ctx, data, formatter, title) {
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
          barThickness: ChartValue.BAR_THICKNESS,
          minBarLength: ChartValue.MIN_BAR_LENGTH,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: ChartValue.DATALABELS_SIZE,
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
          fontSize: ChartValue.TITLE_FONT_SIZE,
          position: `left`
        },
        layout: {
          padding: {
            left: ChartValue.LAYOT_PADDING,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: `#000000`,
              padding: ChartValue.TICKS_PADDING,
              fontSize: ChartValue.TICKS_FONT_SIZE,
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
  }

  _printMoneyChart(moneyCtx, data) {
    const formatValue = (val) => `€ ${val}`;
    this._createChartTemplate(moneyCtx, data, formatValue, ChartTitle.MONEY);
  }

  _printTransportChart(transportCtx, data) {
    const formatValue = (val) => `${val}x`;
    this._createChartTemplate(transportCtx, data, formatValue, ChartTitle.TRANSPORT);
  }

  _printTimeChart(timeCtx, data) {
    const formatValue = (val) => `${getChartDuration(val)}`;
    this._createChartTemplate(timeCtx, data, formatValue, ChartTitle.TIME_SPEND);
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

  _getData(cb) {
    const reducer = (sum, event) => {
      const type = event.type;
      if (!sum.has(type)) {
        sum.set(type, 0);
      }
      sum.set(type, sum.get(type) + cb(event));

      if (cb(event)) {
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

  _getMoneyTotal() {
    return this._getData((event) => {
      return +event.pointPrice;
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

  recoveryListeners() {}
}
