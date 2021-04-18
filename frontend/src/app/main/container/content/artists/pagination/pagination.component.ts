import { Component, Input, OnInit } from '@angular/core';
import { PaginationService } from '../services/paginate.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() pages: any;
  @Input() currentPage!: number;

  constructor(
    private paginationService: PaginationService
  ) { }

  ngOnInit(): void {
  }

  onPaginate(page: number | string) {
    console.log(page);
      // send message to the artists page
      this.paginationService.pageStatusService.next({'page': page});
  }

}
