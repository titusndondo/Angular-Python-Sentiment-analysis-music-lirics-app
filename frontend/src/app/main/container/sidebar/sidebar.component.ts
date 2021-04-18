import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  sideBarItems: string[] = ['Home', 'Dashboard', 'Analyse', 'My Analytics'];

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {

  }

  onCloseSidebar() {
    this.sidebarService.isSidebarOpen = false;
    this.sidebarService.sidebarStatusSubject.next({'close': true});

  };
}
