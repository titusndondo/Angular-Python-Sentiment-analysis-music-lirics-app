import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbService } from 'src/app/main/services/breadcrumb.service';
import { HttpClientService } from 'src/app/main/services/http-client.service';
import * as d3 from 'd3';
import { DataService } from 'src/app/main/services/data.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  artistDoc: any;

  numberCardsData: any;

  audioFeaturesData: any;

  constructor(
    private route: ActivatedRoute,
    private httpClientService: HttpClientService,
    private breadcrumbService: BreadCrumbService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => {
        console.log(params);
        this.httpClientService.getArtist(params['id']).subscribe(
          (response: any) => {
            console.log(response)
            this.artistDoc = response;

            this.numberCardsData = [
              { name: 'Followers', value: response.followers },
              { name: 'Popularity', value: response.popularity },
              { name: 'Albums', value: response.albums.length },
              { name: 'Tracks', value: d3.sum(response.albums.map((album: any) => { return album.tracks.length })) }
            ];

            let afs: any[] = [];
            response.albums.map((album: any) => {
              // console.log(album.tracks);
              album.tracks.map((track: any) => {
                // console.log(track.audio_features);
                afs.push(track.audio_features)

              })
             
            });

            let audioFeatures: any[] = [];
            for(let af of Object.keys(afs[0])) {

              let out = [
                {
                  name: '',
                  series: [
                    {
                      name: af, 
                      value:  d3.mean(afs.map((feature: any) => feature[af]))
                    },
                    {
                      name: '', 
                      value:  1 - d3.mean(afs.map((feature: any) => feature[af]))!
                    }
                  ]
                }
              ]
              this.dataService.audioFeaturesTransferSubject.next(out);
              audioFeatures = [...audioFeatures, ...out]

            };
            // console.log(audioFeatures);

            

            this.breadcrumbService.breadCrumbStatusSubject.next({'name': response.name});

          }
        )
      }
    )
  }

}
