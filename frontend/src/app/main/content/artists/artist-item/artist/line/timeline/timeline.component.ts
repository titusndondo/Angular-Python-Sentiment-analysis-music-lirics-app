import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';
import { DataService } from 'src/app/main/services/data.service';
import { PlottingService } from 'src/app/main/services/plotting.service';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {
  @ViewChild('timeline_wrapper') timeline_wrapper!: ElementRef;
  dimensions!: { width: number; height: number };

  constructor(
    private resizeObserverService: ResizeObserverService,
    private plottingService: PlottingService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // console.log(this.timeline_wrapper);
    this.resizeObserverService.observeElement(this.timeline_wrapper);
    this.resizeObserverService.resizeSubject.subscribe((dimensions: any) => {
      this.dimensions = dimensions;
      console.log(dimensions);
      // console.log(this.dataService.albumsLineChartData);
      this.plotLineChartTimeline(
        this.dataService.albumsLineChartData,
        this.dimensions
      );
    });
  }

  plotLineChartTimeline(data: any, dimensions: any) {
    if (!dimensions?.width) return;

    const xScaleExtent = <[Date, Date]>(
      (<unknown>extent(data, (d: any) => d.release_date))
    );
    // console.log(xScaleExtent[0]);

    // console.log(dimensions);
    const svg = select('.timeline-chart')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const xScale: any = scaleTime()
      .domain(xScaleExtent)
      .range([30, dimensions.width]);

    const xAxis: any = axisBottom(xScale).ticks(data.length);

    svg
      .select('.x-axis')
      .style('transform', `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yScale = scaleLinear().domain([0, 100]).range([dimensions.height, 0]);
    const yAxis: any = axisLeft(yScale).ticks(3);
    svg.select('.y-axis').call(yAxis);

    const myLine = line()
      .x((d: any) => xScale(d.release_date))
      .y((d: any) => yScale(d.score))
      .curve(curveMonotoneX);

    svg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', (data: any) => myLine(data))
      .attr('fill', 'transparent')
      .attr('stroke', '#00727f')
      .attr('stroke-width', '2px');

    // const circleGroup = svg
    //   .append('g')
    //   .attr('class', 'artist-albums-circles')
    //   .selectAll('.circle')
    //   .data(data)
    //   .join('g')
    //   .attr('class', 'artist-albums-circle-group');
  }
}
