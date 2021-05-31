import { ElementRef, Injectable } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';
import { ResizeObserverEntry } from 'resize-observer/lib/ResizeObserverEntry';
import { Subject } from 'rxjs';

export interface Dimensions {
  width: number;
  height: number;
}

@Injectable({ providedIn: 'root' })
export class ResizeObserverService {
  resizeSubject = new Subject();

  constructor() {}

  observeElement(element: ElementRef) {
    const resizeObserver = new ResizeObserver((entries: any) => {
      let dimensions: Dimensions;
      entries.forEach((entry: ResizeObserverEntry) => {
        // console.log(entry);
        const height = entry.contentRect.height;
        const width = entry.contentRect.width;
        dimensions = { width: width, height: height };

        this.resizeSubject.next(dimensions);
      });
    });

    resizeObserver.observe(element.nativeElement);
  }
}
