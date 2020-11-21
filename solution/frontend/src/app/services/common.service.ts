import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private baseUrl = environment.baseUrl;

  public STR_SUCCESS = "@Success";
  public STR_ERROR = "@Error";

  constructor(private http: HttpClient) {
  }

  private getHttpParams(parameter: any) {
    let queryParams: HttpParams = new HttpParams()

    if (parameter) {
      for (var key in parameter) {
        queryParams = queryParams.set(key, parameter[key]);
      }
    }
    return queryParams;
  }

  getAPIUrl(url: string) {
    return this.baseUrl + url;
  }

  get(url: string, parameter: any = undefined) {
    const options = { params: this.getHttpParams(parameter) };
    return this.http.get(this.getAPIUrl(url), options);
  }

  post(url: string, body: any) {
    return this.http.post(this.getAPIUrl(url), body);
  }

  put(url: string, body: object) {
    return this.http.put(this.getAPIUrl(url), body);
  }

  delete(url: string) {
    return this.http.delete(this.getAPIUrl(url));
  }

  setSessionValue(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  getSessionValue(key: string) {
    return sessionStorage.getItem(key);
  }

  cleanSessionValue(key: string) {
    return sessionStorage.setItem(key, "");
  }

  getBaseUrl() {
    return this.baseUrl;
  }
}

