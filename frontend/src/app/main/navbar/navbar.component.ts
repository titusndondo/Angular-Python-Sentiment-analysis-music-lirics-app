import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

  constructor(
    private sidebarService: SidebarService
  ) { }

  ngOnInit(): void {

  }

  onOpenSidebar() {
    this.sidebarService.isSidebarOpen = true;
    this.sidebarService.sidebarStatusSubject.next({'open': true});
  };

}
