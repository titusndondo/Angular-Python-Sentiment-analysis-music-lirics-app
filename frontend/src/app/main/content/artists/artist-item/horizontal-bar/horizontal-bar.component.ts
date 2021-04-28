import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/main/services/data.service';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';

@Component({
  selector: 'app-horizontal-bar',
  templateUrl: './horizontal-bar.component.html',
  styleUrls: ['./horizontal-bar.component.css']
})
export class HorizontalBarComponent implements OnInit, AfterViewInit {

  @Input() multi: any;
  @ViewChild('wrapper') wrapper!: ElementRef;
  view!: [number, number];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Normalized Population';

  colorScheme = {
    domain: ['#00A489', '#00727F', '#F9F871', '#82D37C']
  };

  constructor(
    private resizeObserverService: ResizeObserverService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    console.log(this.multi);
    
    this.dataService.audioFeaturesTransferSubject.subscribe(
      (response: any) => {
        console.log(response);
        // this.multi = response;
      }
    )
  }

  ngAfterViewInit() {
    this.resizeObserverService.observeElement(this.wrapper);
    this.resizeObserverService.resizeSubject.subscribe(
      (dimensions: any) => {
        this.view = [dimensions.width, dimensions.height]
      }
    )
  }

}
