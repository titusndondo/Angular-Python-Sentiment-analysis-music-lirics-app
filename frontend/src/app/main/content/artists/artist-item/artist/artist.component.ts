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
  wordCloudData: any;

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

          // get numbercards data
          this.numberCardsData = [
            { name: 'Followers', value: response.followers },
            { name: 'Popularity', value: response.popularity },
            { name: 'Albums', value: response.albums.length },
            {
              name: 'Tracks',
              value: d3.sum(
                response.albums.map((album: any) => album.tracks.length)
              ),
            },
          ];

          // get linechart data
          let albumsLineChartData: any = [];
          let wordCloudData: any = [];
          let afs: any[] = [];
          response.albums.map((album: any) => {
            // console.log(album);

            const sentimentCounts: any = [
              { sentiment: 'angry', count: 0 },
              { sentiment: 'sad', count: 0 },
              { sentiment: 'happy', count: 0 },
              { sentiment: 'relaxed', count: 0 },
            ];

            const sentiments = album.tracks.map(
              (track: any) => track.sentiment.sentiment
            );

            sentiments.forEach((sentiment: string) => {
              sentimentCounts.forEach((count: any) => {
                if (count.sentiment == sentiment) count.count += 1;
              });
            });

            const mostFrequentSentiment = sentimentCounts.find((count: any) => {
              return (
                count.count === d3.max(sentimentCounts.map((d: any) => d.count))
              );
            });

            const albumData = {
              album_id: album['id'],
              name: album['name'],
              release_date: album['release_date']
                ? new Date(album['release_date'])
                : undefined,
              cover_art_url: album['cover_art_url'],
              sentiment: mostFrequentSentiment.sentiment,
              score: (mostFrequentSentiment.count / sentiments.length) * 100,
            };
            albumsLineChartData.push(albumData);

            album.tracks.map((track: any) => {
              // console.log(track.audio_features);
              afs.push(track.audio_features);
            });

            // get wordcloud data
            album.tracks.map((track: any) => {
              // console.log(track.sentiment);
              wordCloudData.push(track.sentiment);
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
          this.audioFeaturesData = audioFeatures;

          // console.log(albumsLineChartData);
          albumsLineChartData = albumsLineChartData.filter(
            (d: any) => d.release_date
          );
          this.albumsLineChartData = albumsLineChartData;

          this.wordCloudData = wordCloudData;

          this.breadcrumbService.breadCrumbStatusSubject.next({
            name: response.name,
          });
        });
    });
  }
}
