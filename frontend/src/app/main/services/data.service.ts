import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {
  constructor() { }

  audioFeaturesTransferSubject = new Subject();
  audioFeatures: any;

}