import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataService } from 'src/app/main/services/data.service';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';

@Component({
  selector: 'app-h-bar-s',
  templateUrl: './h-bar-s.component.html',
  styleUrls: ['./h-bar-s.component.css'],
})
export class HBarSComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() item: any;
  @ViewChild('wrapper') wrapper!: ElementRef;
  view: [number, number] = [155, 30];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Normalized Population';

  colorScheme = {
    domain: ['#f1f1f1', '#00727F'],
  };

  constructor(
    private resizeObserverService: ResizeObserverService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    // console.log(this.item);
  }

  ngAfterViewInit() {
    // this.resizeObserverService.observeElement(this.wrapper);
    // this.resizeObserverService.resizeSubject.subscribe((dimensions: any) => {
    //   this.view = [155, 30];
    // });
  }
  ngOnChanges() {
    this.ngOnInit();
  }
}
