import { Component, OnInit } from '@angular/core';
import { HttpClientService } from 'src/app/main/services/http-client.service';
import { PaginationService } from './services/paginate.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {

  data: any;
  pages!: number[];
  currentPage!: number;

  constructor(
    private httpClient: HttpClientService,
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.currentPage = 1;

    this.paginationService.pageStatusService.subscribe(
      (response: any) => {
        if(response.page === 'previous') {
          // go to previous page
          this.currentPage -= 1
        } else if(response.page === 'next') {
          // go to next page
          this.currentPage += 1
        } else {
          //  go to particular page
          this.currentPage = response.page;
        }
        
        // update the DOM
        
      }
    )

    this.httpClient.paginate(this.currentPage).subscribe(
      (artists: any) => {
        // console.log(artists);
        this.data = artists;
        // console.log(artists.length);
        this.pages = [...Array(artists.length).keys()]
          .map((i: number) => i + 1)
      }
    )

  }

}
