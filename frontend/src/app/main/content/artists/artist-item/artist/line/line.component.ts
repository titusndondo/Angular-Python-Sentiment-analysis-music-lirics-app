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
  numberOfRenders = 0;

  constructor(
    private dataService: DataService,
    private lineChartPlot: LinechartPlotService,
    private resizeObserverService: ResizeObserverService
  ) {}

  ngOnInit(): void {
    console.log('Initial render Line');

    this.lineChartPlot.plotLineChart(this.albumsLineChartData, {
      width: 100,
      height: 100,
    });
  }

  ngAfterViewInit() {
    // console.log(this.line_chart_wrapper.nativeElement);
    this.resizeObserverService.observeElement(this.line_chart_wrapper);
    this.resizeObserverService.resizeSubject.subscribe((dimensions: any) => {
      if (this.numberOfRenders === 0) {
        console.log(this.numberOfRenders);
        console.log('Line Size changed');
        this.dimensions = dimensions;
        console.log('Line', dimensions);
        // console.log(this.albumsLineChartData);
        this.lineChartPlot.plotLineChart(
          this.albumsLineChartData,
          this.dimensions
        );
        this.numberOfRenders += 1;
      }
    });
  }

  ngOnChanges() {
    // console.log('Changed');
    this.lineChartPlot.plotLineChart(this.albumsLineChartData, this.dimensions);
  }

  ngOnDestroy() {
    this.resizeObserverService.resizeSubject.unsubscribe();
  }
}
