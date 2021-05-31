import { Injectable } from '@angular/core';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
import { select, selectAll } from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';
import { timeFormat } from 'd3-time-format';

@Injectable({ providedIn: 'root' })
export class PlottingService {
  constructor() {}

  plotLineChart(data: any, dimensions: any) {
    if (!dimensions?.width) return;

    const xScaleExtent = <[Date, Date]>(
      (<unknown>extent(data, (d: any) => d.release_date))
    );
    // console.log(xScaleExtent[0]);

    const chartSvg = select('.line-chart')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const timelineSvg = select('.timeline-chart')
      .attr('width', dimensions.width)
      .attr('height', 80);

    const xScale: any = scaleTime()
      .domain(xScaleExtent)
      .range([30, dimensions.width]);

    const xAxis: any = axisBottom(xScale).ticks(data.length);

    chartSvg
      .select('.x-axis')
      .style('transform', `translateY(${dimensions.height}px)`)
      .call(xAxis);

    // timelineSvg
    //   .select('.x-axis')
    //   .style('transform', `translateY(${dimensions.height}px)`)
    //   .call(xAxis);

    const yScale = scaleLinear().domain([0, 100]).range([dimensions.height, 0]);
    const yAxis: any = axisLeft(yScale).ticks(3);
    chartSvg.select('.y-axis').call(yAxis);

    const yScale2 = scaleLinear().domain([0, 100]).range([80, 0]);
    const yAxis2: any = axisLeft(yScale2).ticks(3);
    timelineSvg.select('.y-axis-t').call(yAxis2);

    const continentColor = scaleOrdinal([
      '#00A489',
      '#00727F',
      '#F9F871',
      '#82D37C',
    ]);

    const myLine = line()
      .x((d: any) => xScale(d.release_date))
      .y((d: any) => yScale(d.score))
      .curve(curveMonotoneX);

    const myLine2 = line()
      .x((d: any) => xScale(d.release_date))
      .y((d: any) => yScale2(d.score))
      .curve(curveMonotoneX);

    chartSvg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', (data: any) => myLine(data))
      .attr('fill', 'transparent')
      .attr('stroke', '#00727f')
      .attr('stroke-width', '2px');

    timelineSvg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', (data: any) => myLine2(data))
      .attr('fill', 'transparent')
      .attr('stroke', '#00727f')
      .attr('stroke-width', '2px');

    const circleGroup = chartSvg
      .append('g')
      .attr('class', 'artist-albums-circles')
      .selectAll('.circle')
      .data(data)
      .join('g')
      .attr('class', 'artist-albums-circle-group');

    circleGroup
      .append('circle')
      .attr('class', 'artist-albums-circle btn btn-outline-light')
      .attr('cx', (d: any) => xScale(d.release_date))
      .attr('cy', (d: any) => yScale(d.score))
      .attr('r', 10)
      .attr('fill', (d: any) => continentColor(d.sentiment));

    circleGroup.on('mouseenter', function (event, d: any) {
      // console.log(select(this));
      // console.log(d);
      const e = circleGroup.nodes();
      const i: any = e.indexOf(this);

      // console.log(e);
      // console.log(i);
    });
  }
}
