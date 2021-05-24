import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/main/services/data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.css']
})
export class ArtistProfileComponent implements OnInit {

  items: any;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.items = this.dataService.audioFeatures;
    this.dataService.audioFeaturesTransferSubject.subscribe((response: any) => {
      // console.log('Arrived');
      // console.log(response);
      // this.items = response;
      
    })
  }

}
