import { Component, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  //This is a simple configuration object to store all the charts configurations
  chart = {
    "productSales": {
      "title": "Product Sales For Each Day",
      "type": ChartType.LineChart,
      "data": [],
      "columnNames": ['day', 'Product 1', 'Product 2', 'Product 3'],
      "options": {
        "title": 'Product Sales Per Day',
        "curveType": 'function',
        "legend": { position: 'bottom' }
      },
      "width": 600,
      "height": 400
    },
    "marketComposition": {
      "title": "Product Demand Composition",
      "type": ChartType.PieChart,
      "data": [],
      "columnNames": ['Product', 'Percentage'],
      "options": {},
      "width": 600,
      "height": 400
    },
    "daywiseAmounts": {
      "title": "Amount Trasacted On Each Day",
      "type": ChartType.AreaChart,
      "data": [],
      "columnNames": ['Day', 'Product 1', 'Product 2', 'Product 3'],
      "options": {},
      "width": 600,
      "height": 400
    },
    "paymentTypes": {
      "title": "Preferred Modes of Payment",
      "type": ChartType.PieChart,
      "data": [],
      "columnNames": ['Type', 'Percentage'],
      "options": {
        pieHole: 0.4
      },
      "width": 600,
      "height": 400
    },
    "countrywiseSales": {
      "title": "Purchases Done In Each Country",
      "type": ChartType.BarChart,
      "data": [],
      "columnNames": ['Country', 'Product 1', 'Product 2', 'Product 3'],
      "options": {
        hAxis: {
          title: 'Country'
        },
        vAxis: {
          minValue: 0
        }
      },
      "width": 1200,
      "height": 800
    }
  }

  constructor(private _cs: CommonService) { }

  ngOnInit(): void {
    this.getCharts()
  }

/**
 * This function will fetch the data from the server for the charts
 */
  getCharts() {
    this._cs.get('file/getReports').subscribe(
      (response: any) => {
        console.log(response);
        this.chart['productSales'].data = response.data['productSalesPerMonth'];
        this.chart['marketComposition'].data = response.data['marketComposition'];
        this.chart['daywiseAmounts'].data = response.data['daywiseAmounts'];
        this.chart['paymentTypes'].data = response.data['preferredPaymentType'];
        this.chart['countrywiseSales'].data = response.data['countrywiseSales'];
      },
      (error: any) => {
        // this.message = "Trouble in connecting server. Please try later";
        console.log(error);
      }
    );
  }

  resetWindowSize(chart, event) {
    //Reset the width and height based on current window size
    chart.width = event.target.innerWidth;
    chart.height = event.target.innerHeight;
  }

}
