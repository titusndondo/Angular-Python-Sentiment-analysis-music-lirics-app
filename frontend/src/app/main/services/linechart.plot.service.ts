import { Injectable } from '@angular/core';
import { extent } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { brushX } from 'd3-brush';
import { easeCircleIn } from 'd3-ease';
import { scaleLinear, scaleOrdinal, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { curveMonotoneX, line } from 'd3-shape';

@Injectable({ providedIn: 'root' })
export class LinechartPlotService {
  constructor() {}

  plotLineChart(data: any, dimensions: any) {
    if (!dimensions?.width) return;
    // console.log(data);

    const legendAttributes: any = [
      { sentiment: 'Sad', color: '#00A489', value: 50 },
      { sentiment: 'Angry', color: '#00727F', value: 65 },
      { sentiment: 'Happy', color: '#F9F871', value: 68 },
      { sentiment: 'Relaxed', color: '#82D37C', value: 75 },
    ];

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

    const timelineSvgHeight = 60;
    const timelineSvg = select('.timeline-chart')
      .attr('width', dimensions.width)
      .attr('height', timelineSvgHeight);

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

    const yScaleTimeline = scaleLinear()
      .domain([0, 100])
      .range([timelineSvgHeight, 0]);
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
      const circleGroups = chartContent
        .append('g')
        .attr('class', 'artist-albums-circles')
        .selectAll('.circle')
        .data(data)
        .join('g')
        .attr('class', 'circle-group');

      const circles = circleGroups
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

      circleGroups
        .on('mouseenter', function (event, d: any) {
          // console.log(select(this));
          // console.log(d);
          const circleGroup = circleGroups.nodes();
          const i: any = circleGroup.indexOf(this);

          // console.log(e);
          // console.log(select(e[i]));

          // console.log(select(e[i]).select('image'));
          select(circleGroup[i])
            .append('defs')
            .attr('class', 'img-defs')
            .append('pattern')
            .attr('id', 'image')
            .attr('x', '0%')
            .attr('y', '0%')
            .attr('height', '100%')
            .attr('width', '100%')
            .attr('viewBox', `0 0 ${50} ${50}`)
            .append('image')
            .attr('xlink:href', d.cover_art_url)
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 50)
            .attr('width', 50);

          select(circles.nodes()[i])
            .attr('fill', 'url(#image)')
            .transition()
            .duration(500)
            .ease(easeCircleIn)
            .attr('r', 30)
            .attr('stroke', '#f1f1f1')
            .attr('stroke-width', '2px');

          select(circleGroup[i])
            .append('text')
            .attr('x', addAxis(xScaleExtent).xScale(d.release_date) - 25)
            .attr('y', addAxis(xScaleExtent).yScale(d.score) + 50)
            .text((d: any) => d.name)
            .attr('fill', '#f1f1f1')
            .attr('class', 'label');
        })
        .on('click', function (event, d: any) {
          console.log(d);
        })
        .on('mouseleave', function (event, d: any) {
          const circleGroup = circleGroups.nodes();
          const i: any = circleGroup.indexOf(this);

          select(circles.nodes()[i])
            .transition()
            .duration(200)
            .ease(easeCircleIn)
            .attr('r', 6)
            .attr('stroke', 'none')
            .attr('fill', (d: any) => continentColor(d.sentiment));
          select(circleGroup[i]).select('.img-defs').remove();
          select(circleGroup[i]).select('.label').remove();
        });
    };

    const brush: any = brushX()
      .extent([
        [0, 0],
        [dimensions.width, timelineSvgHeight],
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

    let legend = select('.line-chart-legend')
      .attr('width', 227)
      .attr('height', 245)
      .append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${0},${0})`);

    // const sentiments = ['Sad', 'Angry', 'Happy', 'Relaxed']

    legendAttributes.forEach((legendAttribute: any, i: number) => {
      let legendRow = legend
        .append('g')
        .attr('class', 'legend-item')
        .attr('transform', `translate(0, ${i * 60})`);

      legendRow
        .append('rect')
        .attr('class', 'btn legend-btn')
        .attr('x', 75)
        .attr('y', 50)
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', continentColor(legendAttribute.sentiment))
        .attr('rx', 2);

      legendRow
        .append('text')
        .attr('class', 'btn legend-text')
        .attr('x', legendAttribute.value + 85)
        .attr('y', 65)
        .attr('text-anchor', 'end')
        .text(legendAttribute.sentiment)
        .attr('fill', '#f1f1f1')
        .style('font-weight', 100);
    });
  }
}
