import { Component, OnInit } from '@angular/core';
import { NavHistory } from './NAV.model';
import { BackendService } from './backend.service';
import * as lodash from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'srv';
  investedDate: Date;
  investedAmount: number;

  navHistoryList: NavHistory[] = [];
  purchesedNetAssetValue: number;
  lastNetAssetValue: number;
  units: number;
  currentValue: number;
  loader = false;

  constructor(private backend: BackendService) {

  }

  ngOnInit(): void {

  }

  ProcessData() {

  }

  async Calculate() {
    this.currentValue = undefined;
    this.loader = true;
    console.log(this.investedDate, this.investedAmount);
    const result = await this.backend.GetNavHistory(this.investedDate, moment().format('YYYY-MM-DD')) as string;
    console.log(result);
    const rows = result.match(/.*;Axis Long Term Equity Fund - Direct Plan - Dividend option;.*;.*;.*;.*;.*;.*/gm);
    // console.log(rows);
    rows.forEach(row => {
      const values = row.split(';');
      const navHistory = new NavHistory();
      navHistory.schemeCode = parseInt(values[0]);
      navHistory.schemeName = values[1];
      navHistory.payoutGrowth = values[2];
      navHistory.reinvestment = values[3];
      navHistory.netAssetValue = parseFloat(values[4]);
      navHistory.repurchasePrice = parseFloat(values[5]);
      navHistory.salePrice = parseFloat(values[6]);
      navHistory.date = values[7];
      this.navHistoryList.push(navHistory);
    });
    lodash.remove(this.navHistoryList, e => isNaN(e.schemeCode));
    lodash.sortBy(this.navHistoryList, p => p.date);
    console.log(this.navHistoryList);
    this.purchesedNetAssetValue = this.navHistoryList[0].netAssetValue;
    this.lastNetAssetValue = this.navHistoryList[this.navHistoryList.length - 1].netAssetValue;

    this.units = this.investedAmount / this.purchesedNetAssetValue;
    this.loader = false;
    this.currentValue = this.units * this.lastNetAssetValue;
    console.log(this.purchesedNetAssetValue);
    console.log(this.lastNetAssetValue);
    console.log(this.units);
    console.log(this.currentValue);

  }

}
