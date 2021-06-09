import { Injectable } from '@angular/core';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';

@Injectable({ providedIn: 'root' })
export class WordcloudPlotService {
  constructor() {}

  plotWordCloud(data: any, dimensions: any) {
    if (!dimensions?.width) return;

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

    const chartSvg = select('.wordcloud-chart')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height);

    const xScale: any = scaleLinear()
      .domain([0, 100])
      .range([0, dimensions.width]);
    const xAxis: any = axisBottom(xScale);
    chartSvg
      .select('.x-axis')
      .style('transform', `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yScale = scaleLinear().domain([0, 100]).range([dimensions.height, 0]);
    const yAxis: any = axisLeft(yScale);
    chartSvg.select('.y-axis').call(yAxis);
  }
}
