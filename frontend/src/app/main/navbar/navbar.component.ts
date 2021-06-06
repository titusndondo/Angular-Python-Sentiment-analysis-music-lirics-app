import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClientService } from '../services/http-client.service';
import { SidebarService } from '../services/sidebar.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  searchArtistForm!: FormGroup;
  inputValue = '';
  showSearchPopup = false;
  allArtists: any;

  constructor(
    private sidebarService: SidebarService,
    private httpClient: HttpClientService
  ) {}

  ngOnInit(): void {
    this.searchArtistForm = new FormGroup({
      name: new FormControl(''),
    });

    this.searchArtistForm
      .get('name')
      ?.valueChanges.subscribe((name: string) => {
        // console.log(name.length);
        this.inputValue = name;
        if (name.length > 0) this.showSearchPopup = true;
        if (name.length === 0) this.showSearchPopup = false;

        // get relevant artists names and ids
        this.httpClient.getAllArtists().subscribe((response: any) => {
          // console.log(response);
          this.allArtists = response.filter((artistName: any) => {
            return artistName.name.startsWith(name);
          });
          // console.log(this.allArtists);
        });
      });
  }

  onOpenSidebar() {
    this.sidebarService.isSidebarOpen = true;
    this.sidebarService.sidebarStatusSubject.next({ open: true });
  }

  onSubmit() {
    console.log('Submitted');
    console.log(this.searchArtistForm);
  }

  onViewArtist(e: Event, item: any) {
    e.preventDefault();
    this.showSearchPopup = false;
    // console.log('More requested');
    // console.log(item);
  }
}
