import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/main/services/data.service';

@Component({
  selector: 'app-artist-profile',
  templateUrl: './artist-profile.component.html',
  styleUrls: ['./artist-profile.component.css'],
})
export class ArtistProfileComponent implements OnInit, AfterViewInit {
  @Input() audioFeaturesData: any;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {}

  ngAfterViewInit() {}
}
