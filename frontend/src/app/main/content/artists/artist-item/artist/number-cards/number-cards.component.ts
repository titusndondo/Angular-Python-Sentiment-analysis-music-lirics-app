import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-number-cards',
  templateUrl: './number-cards.component.html',
  styleUrls: ['./number-cards.component.css'],
})
export class NumberCardsComponent implements OnInit {
  @Input() numberCardsData: any;

  constructor() {}

  ngOnInit(): void {
    // console.log(this.numberCardsData);
  }

  numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
