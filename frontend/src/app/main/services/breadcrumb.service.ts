import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class BreadCrumbService {
  constructor() { }

  breadCrumbStatus = {
    'artists': {'visible': true, 'active': true},
    'artist': {'visible': false, 'active': false, 'name': null},
    'track': {'visible': false, 'active': false}
  }

  breadCrumbStatusSubject = new Subject()
  
}