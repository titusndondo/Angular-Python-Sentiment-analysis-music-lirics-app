import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ResizeObserverService } from 'src/app/main/services/resize-observer.service';

@Component({
  selector: 'app-number-cards',
  templateUrl: './number-cards.component.html',
  styleUrls: ['./number-cards.component.css']
})
export class NumberCardsComponent implements OnInit, AfterViewInit {

  @Input() numberCardsData: any;
  @ViewChild('wrapper') wrapper!: ElementRef;

  view!: [number, number];

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };
  cardColor: string = '#232837';

  constructor(
    private resizeObserverService: ResizeObserverService
  ) { }

  ngOnInit(): void {
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
