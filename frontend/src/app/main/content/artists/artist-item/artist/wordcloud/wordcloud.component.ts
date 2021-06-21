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
import { HttpClientService } from 'src/app/main/services/http-client.service';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';
import { WordcloudPlotService } from 'src/app/main/services/wordcloud.plot.service';

@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrls: ['./wordcloud.component.css'],
})
export class WordcloudComponent
  implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
  @Input() wordCloudData: any;
  @ViewChild('wordcloud_wrapper') wordcloud_wrapper!: ElementRef;
  @ViewChild('legendWrapper') legendWrapper!: ElementRef;
  wordCounts: any = [];
  dimensions!: { width: number; height: number };

  constructor(
    private wordCloudPlot: WordcloudPlotService,
    private resizeObserverService: ResizeObserverService
  ) {}

  ngOnInit(): void {
    // console.log(this.wordCloudData);
    // this.dataPrep();
    // console.log(this.wordCounts);
  }

  ngAfterViewInit() {
    this.resizeObserverService.observeElement(this.wordcloud_wrapper);
    this.resizeObserverService.resizeSubject.subscribe((dimensions: any) => {
      if (dimensions.target === this.wordcloud_wrapper.nativeElement) {
        this.dimensions = dimensions;
        // console.log('Wordcloud', this.dimensions);
        // console.log(this.wordCounts);
        this.wordCloudPlot.plotWordCloud(this.wordCounts, this.dimensions);
      }
    });
  }

  ngOnChanges() {
    this.dataPrep();
    this.wordCloudPlot.plotWordCloud(this.wordCounts, this.dimensions);
  }

  ngOnDestroy() {
    // this.resizeObserverService.resizeSubject.unsubscribe();
  }

  dataPrep() {
    const sentiments = ['sad', 'angry', 'happy', 'relaxed'];
    this.wordCounts = [];

    sentiments.forEach((sentiment: string) => {
      let counts: any = [];
      const giantStringOfWords: string = this.wordCloudData
        .filter((d: any) => d.sentiment === sentiment)
        .map((d: any) => d.lyrics)
        .join(' ');

      giantStringOfWords.split(' ').forEach((word: string) => {
        let doc = {};
        let found = counts.map((d: any) => d.word);
        doc = { sentiment: sentiment };
        if (!found.includes(word)) {
          doc = { ...doc, ...{ word: word, count: 1 } };
          counts.push(doc);
        }
        if (found.includes(word)) {
          counts.find((d: any) => {
            return d.word === word;
          }).count += 1;
        }
      });

      counts = counts
        .map((d: any) => {
          return { ...d, ...{ freq: (d.count / counts.length) * 100 } };
        })
        .sort((a: { freq: number }, b: { freq: number }) => b.freq - a.freq)
        .filter((d: any) => d.freq <= 100);
      // console.log(counts.slice(0, 1));
      this.wordCounts = [...this.wordCounts, ...counts];
      this.wordCounts.forEach((d: any) => {
        d.x = Math.floor(Math.random() * 100);
        d.y = Math.floor(Math.random() * 100);
      });
      this.wordCounts = this.wordCounts
        .sort((a: { freq: number }, b: { freq: number }) => b.freq - a.freq)
        .slice(0, 50);
    });
  }
}
