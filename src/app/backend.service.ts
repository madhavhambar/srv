import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  async post(url: string, data: any) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    const promise = new Promise((resolve, reject) =>
      this.http.post(url, JSON.stringify(data), httpOptions)
        .subscribe((response) => {
          console.log('post', url, data, response);
          resolve(response);
        },
          err => { console.log('post error', url, data, err); reject(err.status); })
    );

    return promise;
  }

  async get(url: string) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Encoding': 'gzip',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
      })
    };

    const promise = new Promise((resolve, reject) =>
      this.http.get(url, httpOptions)
        .subscribe((response) => {
          resolve(response);
        },
          err => { console.log('get error', url, err); reject(err.status); }
        )
    );

    return promise;
  }

  async GetNavHistory(from: Date | string, to: Date | string) {
    console.log(to);
    const promise = new Promise((resolve, reject) =>
      this.http.get('http://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=53&tp=1&frmdt=' + from
        + '&todt=' + to, { responseType: 'text' })
        .subscribe((response) => {
          resolve(response);
        },
          err => { console.log('get error', err); reject(err.status); }
        )
    );
    return promise;
  }
}
