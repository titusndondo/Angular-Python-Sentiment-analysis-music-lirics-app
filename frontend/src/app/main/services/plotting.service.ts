import { Injectable } from '@angular/core';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { brushX } from 'd3-brush';
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';

@Injectable({ providedIn: 'root' })
export class PlottingService {
  constructor() {}

  plotLineChart(data: any, dimensions: any) {
    if (!dimensions?.width) return;
    // console.log(xScaleExtent[0]);

    const continentColor = scaleOrdinal([
      '#00A489',
      '#00727F',
      '#F9F871',
      '#82D37C',
    ]);

    const chartSvg = select('.line-chart')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const chartContent = chartSvg.select('.content');

    const timelineSvg = select('.timeline-chart')
      .attr('width', dimensions.width)
      .attr('height', 80);

    const xScaleExtent = <[Date, Date]>(
      (<unknown>extent(data, (d: any) => d.release_date))
    );

    const brushRangeStart = xScaleExtent[0];
    let brushFullRange = [
      brushRangeStart,
      new Date(
        `${brushRangeStart.getMonth()}-${brushRangeStart.getDay()}-${
          brushRangeStart.getFullYear() + 3
        }`
      ),
    ];

    const xScaleTimeline: any = scaleTime()
      .domain(xScaleExtent)
      .range([30, dimensions.width]);

    const yScaleTimeline = scaleLinear().domain([0, 100]).range([80, 0]);
    const yAxisTimeline: any = axisLeft(yScaleTimeline).ticks(3);
    timelineSvg.select('.y-axis-t').call(yAxisTimeline);

    const lineTimeline = line()
      .x((d: any) => xScaleTimeline(d.release_date))
      .y((d: any) => yScaleTimeline(d.score))
      .curve(curveMonotoneX);

    timelineSvg
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', (data: any) => lineTimeline(data))
      .attr('fill', 'transparent')
      .attr('stroke', '#00727f')
      .attr('stroke-width', '1px');

    // Main Chart
    const addAxis = (xScaleExtent: Date[]) => {
      const xScale: any = scaleTime()
        .domain(xScaleExtent)
        .range([30, dimensions.width]);
      const xAxis: any = axisBottom(xScale).ticks(5);
      chartSvg
        .select('.x-axis')
        .style('transform', `translateY(${dimensions.height}px)`)
        .call(xAxis);

      const yScale = scaleLinear()
        .domain([0, 100])
        .range([dimensions.height, 0]);
      const yAxis: any = axisLeft(yScale).ticks(3);
      chartSvg.select('.y-axis').call(yAxis);

      return {
        xScale: xScale,
        yScale: yScale,
      };
    };

    const addLine = (xScaleExtent: Date[]) => {
      const lineChart = line()
        .x((d: any) => addAxis(xScaleExtent).xScale(d.release_date))
        .y((d: any) => addAxis(xScaleExtent).yScale(d.score))
        .curve(curveMonotoneX);

      chartContent
        .selectAll('.line')
        .data([data])
        .join('path')
        .attr('class', 'line')
        .attr('d', (data: any) => lineChart(data))
        .attr('fill', 'transparent')
        .attr('stroke', '#00727f')
        .attr('stroke-width', '2px');
    };

    const addCircles = (xScaleExtent: Date[]) => {
      select('.artist-albums-circles').remove();
      const circleGroup = chartContent
        .append('g')
        .attr('class', 'artist-albums-circles')
        .selectAll('.circle')
        .data(data)
        .join('g');

      circleGroup
        .append('circle')
        .attr('class', 'artist-albums-circle btn btn-outline-light')
        .attr('cx', (d: any) => addAxis(xScaleExtent).xScale(d.release_date))
        .attr('cy', (d: any) => addAxis(xScaleExtent).yScale(d.score))
        .attr('r', (d: any) =>
          d.release_date >= xScaleExtent[0] && d.release_date <= xScaleExtent[1]
            ? 6
            : 3
        )
        .attr('fill', (d: any) => continentColor(d.sentiment));
    };

    const brush: any = brushX()
      .extent([
        [0, 0],
        [dimensions.width, 80],
      ])
      .on('start brush end', (event) => {
        if (event.selection) {
          const brushFullRange = event.selection.map(
            addAxis(xScaleExtent).xScale.invert
          );
          // console.log(brushFullRange);
          addLine(brushFullRange);
          addCircles(brushFullRange);
        }
      });

    timelineSvg
      .select('.brush')
      .call(brush)
      .call(brush.move, brushFullRange.map(addAxis(xScaleExtent).xScale));

    let continents = ['Sad', 'Angry', 'Happy', 'Relaxed'];

    let legend = select('.line-chart-legend')
      .attr('width', 227)
      .attr('height', 245)
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${0},${0})`);

    continents.forEach((continent, i) => {
      let legendRow = legend
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', `translate(0, ${i * 50})`);

      legendRow
        .append('rect')
        .attr('class', 'btn legend-btn')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', continentColor(continent));

      legendRow
        .append('text')
        .attr('class', 'btn legend-text')
        .attr('x', -10)
        .attr('y', 10)
        .attr('text-anchor', 'end')
        .text(continent)
        .attr('fill', '#f1f1f1')
        .style('font-weight', 100);
      // .attr('transform', 'translate(100, 0)');
    });

    // circleGroup.on('mouseenter', function (event, d: any) {
    // console.log(select(this));
    // console.log(d);
    // const e = circleGroup.nodes();
    // const i: any = e.indexOf(this);

    // console.log(e);
    // console.log(i);
    // });
  }
}
