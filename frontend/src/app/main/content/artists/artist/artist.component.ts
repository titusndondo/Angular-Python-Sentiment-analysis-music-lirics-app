import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbService } from 'src/app/main/services/breadcrumb.service';
import { DataService } from 'src/app/main/services/data.service';
import { HttpClientService } from 'src/app/main/services/http-client.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  artistDoc: any;

  constructor(
    private route: ActivatedRoute,
    private httpClientService: HttpClientService,
    private breadcrumbService: BreadCrumbService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        console.log(params);
        this.httpClientService.getArtist(params['id']).subscribe(
          (response: any) => {
            console.log(response)
            this.artistDoc = response;
            this.breadcrumbService.breadCrumbStatusSubject.next({'name': response.name})

          }
        )
      }
    )
  }

}
