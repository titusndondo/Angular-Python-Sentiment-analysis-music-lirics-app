import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  isSidebarOpen!: boolean;

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {
    this.isSidebarOpen = this.sidebarService.isSidebarOpen;
    this.sidebarService.sidebarStatusSubject.subscribe(
      (response: any) => {
        console.log('Message recieved: Opening sidebar ...');
        console.log(response);
        this.isSidebarOpen = response.open;
      }
    )
  }

}
