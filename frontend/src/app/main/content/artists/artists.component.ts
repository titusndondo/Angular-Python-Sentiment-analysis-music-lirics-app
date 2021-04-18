import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService } from 'src/app/main/services/breadcrumb.service';
import { HttpClientService } from 'src/app/main/services/http-client.service';
import { PaginationService } from 'src/app/main/services/paginate.service';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css']
})
export class ArtistsComponent implements OnInit {

  data: any;
  currentPage!: number;
  paginationVisible: boolean = false;

  constructor(
    private httpClient: HttpClientService,
    private paginationService: PaginationService,
    private breadcrumbService: BreadCrumbService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    if(!this.currentPage) this.router.navigate(['artists', 'page', 1]);
    
    this.route.params.subscribe(
      params => {
        this.currentPage = parseInt(params['page_num']);
        this.paginate(this.currentPage);
      }
    )

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
          this.paginate(response.page);
        }
        
        // update the DOM
        
      }
    )

  }

  paginate(page: number) {
    this.httpClient.paginate(page).subscribe(
      (artists: any) => {
        this.data = artists;
        this.breadcrumbService.breadCrumbStatusSubject.next({'resetBreadCrumbs': true});
        this.paginationVisible = true;
      }
    )
  }

  onViewArtist(item: any) {
    // this.router.navigate(['/', 'dashboard', 'artists', item.name, item.id])
  }

}
