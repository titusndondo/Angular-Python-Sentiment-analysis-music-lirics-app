import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbService } from 'src/app/main/services/breadcrumb.service';
import { HttpClientService } from 'src/app/main/services/http-client.service';
import * as d3 from 'd3';
import { DataService } from 'src/app/main/services/data.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit {
  artistDoc: any;

  numberCardsData: any;

  audioFeaturesData: any;

  albumsLineChartData: any;

  constructor(
    private route: ActivatedRoute,
    private httpClientService: HttpClientService,
    private breadcrumbService: BreadCrumbService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // console.log(params);
      this.httpClientService
        .getArtist(params['id'])
        .subscribe((response: any) => {
          // console.log(response);
          this.artistDoc = response;

          this.numberCardsData = [
            { name: 'Followers', value: response.followers },
            { name: 'Popularity', value: response.popularity },
            { name: 'Albums', value: response.albums.length },
            {
              name: 'Tracks',
              value: d3.sum(
                response.albums.map((album: any) => {
                  return album.tracks.length;
                })
              ),
            },
          ];

          let albumsLineChartData: any = [];
          let afs: any[] = [];
          response.albums.map((album: any) => {
            // console.log(album);

            const highest = (arr: any) =>
              (arr || []).reduce(
                (acc: any, el: any) => {
                  acc.k[el] = acc.k[el] ? acc.k[el] + 1 : 1;
                  acc.max = acc.max ? (acc.max < acc.k[el] ? el : acc.max) : el;
                  return acc;
                },
                { k: {} }
              ).max;

            const sentimentCounts: any = {
              angry: 0,
              sad: 0,
              happy: 0,
              relaxed: 0,
            };

            const sentiments = album.tracks.map(
              (track: any) => track.sentiment.sentiment
            );
            sentiments.forEach((sentiment: any) => {
              if (sentiment === 'angry') sentimentCounts.angry += 1;
              if (sentiment === 'sad') sentimentCounts.sad += 1;
              if (sentiment === 'happy') sentimentCounts.happy += 1;
              if (sentiment === 'relaxed') sentimentCounts.relaxed += 1;
            });

            const mostFrequentSentiment = highest(sentiments);
            const frequencyPercentage =
              (sentimentCounts[mostFrequentSentiment] / sentiments.length) *
              100;

            const albumData = {
              name: album['name'],
              release_date: album['release_date']
                ? new Date(album['release_date'])
                : undefined,
              cover_art_url: album['cover_art_url'],
              sentiment: mostFrequentSentiment,
              score: frequencyPercentage,
            };
            albumsLineChartData.push(albumData);

            album.tracks.map((track: any) => {
              // console.log(track.audio_features);
              afs.push(track.audio_features);
            });
          });

          let audioFeatures: any[] = [];
          for (let af of Object.keys(afs[0])) {
            let out = [
              {
                name: '',
                series: [
                  {
                    name: af,
                    value: d3.mean(afs.map((feature: any) => feature[af])),
                  },
                  {
                    name: '',
                    value: 1 - d3.mean(afs.map((feature: any) => feature[af]))!,
                  },
                ],
              },
            ];

            audioFeatures = [...audioFeatures, ...out];
          }

          audioFeatures = audioFeatures.filter(
            (d: any) => d.series[0].name !== 'key'
          );
          audioFeatures = audioFeatures.filter(
            (d: any) => d.series[0].name !== 'loudness'
          );
          audioFeatures = audioFeatures.filter(
            (d: any) => d.series[0].name !== 'tempo'
          );
          this.dataService.audioFeatures = audioFeatures;

          // console.log(albumsLineChartData);
          albumsLineChartData = albumsLineChartData.filter(
            (d: any) => d.release_date
          );
          this.dataService.albumsLineChartData = albumsLineChartData;

          this.breadcrumbService.breadCrumbStatusSubject.next({
            name: response.name,
          });
        });
    });
  }
}
