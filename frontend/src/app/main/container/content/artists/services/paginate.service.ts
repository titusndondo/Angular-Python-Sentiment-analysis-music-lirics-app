import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class PaginationService {
  constructor() { }
  
  pageStatusService = new Subject();
}