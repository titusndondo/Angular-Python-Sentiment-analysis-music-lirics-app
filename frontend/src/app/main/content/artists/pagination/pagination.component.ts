import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientService } from 'src/app/main/services/http-client.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  numberOfArtists!: number;
  numberOfPages!: number;
  numberOfItemsPerPage: number = 5;
  pages: number[] = [];
  @Input() currentPage!: number;

  constructor(
    private httpClient: HttpClientService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.httpClient.getNumberOfArtists().subscribe(
      (response: any) => {
        this.numberOfArtists = response.number_of_artists;
        this.numberOfPages = Math.round(this.numberOfArtists / this.numberOfItemsPerPage);

        let start = this.currentPage === 1 ? this.currentPage - 1 : this.currentPage - 2;
        let end = this.currentPage === 1 ? this.currentPage + 6 : this.currentPage + 7;
        this.pages = [...Array(this.numberOfPages).keys()]
          .map((i: number) => i + 1)
          .slice(start, end);

      }
    )
  }

  onPaginate(e: any, page: number | string) {
    e.preventDefault();
    // navigate
    if(page === 'previous') page = this.currentPage - 1;
    if(page === 'next') page = this.currentPage + 1;
    if(page > 0 && page < this.numberOfPages + 1)
      this.router.navigate(['artists', 'page', page]);
      this.ngOnInit();

  }

}
