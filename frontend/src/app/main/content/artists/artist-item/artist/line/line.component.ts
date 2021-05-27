import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { extent, max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { NumberValue, scaleLinear, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { curveCardinal, line } from 'd3-shape';
import { timeFormat, timeParse } from 'd3-time-format';
import * as moment from 'moment';
import { DataService } from 'src/app/main/services/data.service';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.css'],
})
export class LineComponent implements OnInit, AfterViewInit {
  data: any = [25, 30, 45, 60, 20, 65, 75, 15, 25];
  @ViewChild('wrapper') wrapper!: ElementRef;

  dimensions!: { width: number; height: number };

  constructor(
    private dataService: DataService,
    private resizeObserverService: ResizeObserverService
  ) {}

  ngOnInit(): void {
    // console.log(this.dataService.albumsLineChartData);
  }

  ngAfterViewInit() {
    this.resizeObserverService.observeElement(this.wrapper);
    this.resizeObserverService.resizeSubject.subscribe((dimensions: any) => {
      this.dimensions = dimensions;
      // console.log(this.dimensions);
      this.plot(
        this.dataService.albumsLineChartData.slice(0, 5),
        this.dimensions
      );
    });
  }

  plot(data: any, dimensions: any) {
    if (!dimensions?.width) return;

    // time parsers/formatters
    const parseTime = timeParse('%d/%m/%Y');
    const formatTime = timeFormat('%d/%m/%Y');

    data = data.map((d: any) => {
      return {
        cover_art_url: d.cover_art_url,
        name: d.name,
        score: d.score,
        sentiment: d.sentiment,
        release_date: new Date(d.release_date),
      };
    });

    const xScaleExtent = <[Date, Date]>(
      (<unknown>extent(data, (d: any) => d.release_date))
    );
    // console.log(xScaleExtent[0]);

    const svg = select('.line-chart');
    // console.log(moment().month(0).format("MMMM"));
    const xScale: any = scaleTime()
      .domain(xScaleExtent)
      .range([0, dimensions.width]);
    const xAxis: any = axisBottom(xScale).ticks(data.length * 2); //.tickFormat((index: any) => index + 1);
    svg
      .select('.x-axis')
      .style('transform', `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yScale = scaleLinear().domain([0, 1]).range([dimensions.height, 0]);
    const yAxis: any = axisLeft(yScale).ticks(5);
    svg.select('.y-axis').call(yAxis);

    const myLine = line()
      .x((d: any) => xScale(d.release_date))
      .y((d: any) => yScale(d.score))
      .curve(curveCardinal);

    svg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', (data: any) => myLine(data))
      .attr('fill', 'transparent')
      .attr('stroke', '#00727f')
      .attr('stroke-width', '2px');
  }
}
