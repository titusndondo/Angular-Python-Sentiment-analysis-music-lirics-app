import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DataService } from 'src/app/main/services/data.service';
import { LinechartPlotService } from 'src/app/main/services/linechart.plot.service';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
})
export class LineComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  // data: any = [25, 30, 45, 60, 20, 65, 75, 15, 25];
  @ViewChild('line_chart_wrapper') line_chart_wrapper!: ElementRef;
  @Input() albumsLineChartData: any;

  dimensions!: { width: number; height: number };

  constructor(
    private dataService: DataService,
    private lineChartPlot: LinechartPlotService,
    private resizeObserverService: ResizeObserverService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.resizeObserverService.observeElement(this.line_chart_wrapper);
    this.resizeObserverService.resizeSubject.subscribe((dimensions: any) => {
      if (dimensions.target === this.line_chart_wrapper.nativeElement) {
        this.dimensions = dimensions;
        // console.log('Line', this.dimensions);
        this.lineChartPlot.plotLineChart(
          this.albumsLineChartData,
          this.dimensions
        );
      }
    });
  }

  ngOnChanges() {
    // console.log('Changed');
    this.lineChartPlot.plotLineChart(this.albumsLineChartData, this.dimensions);
  }

  ngOnDestroy() {
    // this.resizeObserverService.resizeSubject.unsubscribe();
  }
}
