import { Component, OnInit } from '@angular/core';
import { BreadCrumbService } from './services/breadcrumb.service';
import { DataService } from './services/data.service';
import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  isSidebarOpen!: boolean;

  breadCrumbStatus: any;

  constructor(
    private sidebarService: SidebarService,
    private breadcrumbService: BreadCrumbService
  ) { }

  ngOnInit(): void {

    this.isSidebarOpen = this.sidebarService.isSidebarOpen;
    this.breadCrumbStatus = this.breadcrumbService.breadCrumbStatus;

    this.sidebarService.sidebarStatusSubject.subscribe(
      (response: any) => {
        this.isSidebarOpen = response.open;
      }
    )
    
    this.breadcrumbService.breadCrumbStatusSubject.subscribe(
      (response: any) => {
        console.log(response);
        if(response.resetBreadCrumbs) {
          console.log('resetting...')
          this.breadCrumbStatus.artists.active = true;
          this.breadCrumbStatus.artist.visible = false;
          this.breadCrumbStatus.artist.active = false;
        }

        if(response.name) {
          console.log('...updating')
          this.breadCrumbStatus.artists.active = false;
          this.breadCrumbStatus.artist.visible = true;
          this.breadCrumbStatus.artist.active = true;
          this.breadCrumbStatus.artist.name = response.name;
        }
      }
    )
  }

}
