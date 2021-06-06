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
import { PlottingService } from 'src/app/main/services/plotting.service';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
})
export class LineComponent implements OnInit, AfterViewInit, OnChanges {
  // data: any = [25, 30, 45, 60, 20, 65, 75, 15, 25];
  @ViewChild('line_chart_wrapper') line_chart_wrapper!: ElementRef;
  @Input() albumsLineChartData: any;

  dimensions!: { width: number; height: number };

  constructor(
    private dataService: DataService,
    private plottingService: PlottingService,
    private resizeObserverService: ResizeObserverService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.resizeObserverService.observeElement(this.line_chart_wrapper);
    this.resizeObserverService.resizeSubject.subscribe((dimensions: any) => {
      this.dimensions = dimensions;
      // console.log(this.dimensions);
      // console.log(this.albumsLineChartData);
      this.plottingService.plotLineChart(
        this.albumsLineChartData,
        this.dimensions
      );
    });
  }

  ngOnChanges() {
    // console.log('Changed');
    this.plottingService.plotLineChart(
      this.albumsLineChartData,
      this.dimensions
    );
  }
}
