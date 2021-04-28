import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-artist-item',
  templateUrl: './artist-item.component.html',
  styleUrls: ['./artist-item.component.css']
})
export class ArtistItemComponent implements OnInit {

  @Input() item: any;

  constructor() { }

  ngOnInit(): void {
  }

  onViewArtist(item: any) {
    // this.router.navigate(['/', 'dashboard', 'artists', item.name, item.id])
  }
}
