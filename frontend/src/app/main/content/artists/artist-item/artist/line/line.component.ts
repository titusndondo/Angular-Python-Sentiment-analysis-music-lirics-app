import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataService } from 'src/app/main/services/data.service';
import { PlottingService } from 'src/app/main/services/plotting.service';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
})
export class LineComponent implements OnInit, AfterViewInit {
  // data: any = [25, 30, 45, 60, 20, 65, 75, 15, 25];
  @ViewChild('line_chart_wrapper') line_chart_wrapper!: ElementRef;

  dimensions!: { width: number; height: number };

  constructor(
    private dataService: DataService,
    private plottingService: PlottingService,
    private resizeObserverService: ResizeObserverService
  ) {}

  ngOnInit(): void {
    // console.log(this.dataService.albumsLineChartData);
  }

  ngAfterViewInit() {
    this.resizeObserverService.observeElement(this.line_chart_wrapper);
    this.resizeObserverService.resizeSubject.subscribe((dimensions: any) => {
      this.dimensions = dimensions;
      // console.log(this.dimensions);
      this.plottingService.plotLineChart(
        this.dataService.albumsLineChartData,
        this.dimensions
      );
    });
  }
}
