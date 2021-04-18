import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {
  constructor() { }

  dataTransferSubject = new Subject();
  
  multi = [
    {
      "name": "sentiment",
      "series": [
        {
          "name": "sad",
          "value": 40
        },
        {
          "name": "angry",
          "value": 30
        },
        {
          "name": "happy",
          "value": 20
        },
        {
          "name": "relaxed",
          "value": 10
        }
      ]
    }
  ];
}