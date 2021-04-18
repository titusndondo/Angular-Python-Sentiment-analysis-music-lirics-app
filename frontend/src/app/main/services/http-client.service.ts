import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class HttpClientService {
  constructor(private httpClient: HttpClient) { }


  baseUrl: string = 'http://127.0.0.1:5000/api/';

  paginate(pageNumber: number) {
    return this.httpClient.get(
      `${this.baseUrl}artists/page/${pageNumber}`
    )
  }
  
}