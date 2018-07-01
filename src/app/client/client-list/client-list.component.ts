import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  users: User[];
  private pageNumber: number;
  private limit: number;
  private hasMorePages: boolean;
  private hoverIndex: number;
  private searchField: string = 'name';
  private searchQuery: string;

  constructor(private clientService: ClientService, private router: Router) { }

  ngOnInit() {
    this.pageNumber = 1;
    this.limit = 10;
    this.getClients();
    this.hoverIndex = null;
  }

  nextPage() {
    if(this.hasMorePages) {
      this.pageNumber++;
      this.getClients();
    }
  }

  previousPage() {
    if(this.pageNumber > 1) {
      this.pageNumber--;
      this.getClients();
    }
  }

  getClients() {
    this.clientService.getClients(this.pageNumber, this.limit).subscribe(
      data => {
        this.clients = data.clients;
        this.hasMorePages = data.has_more;
      }
    );
  }

  setIndex(index){
    this.hoverIndex = index;
  }

  clearIndex() {
    this.hoverIndex = null;
  }

  goToDetails() {
    this.router.navigateByUrl('/client/details/' + this.clients[this.hoverIndex].id);
  }

  searchClients(event) {
    if(event.key ==  "Enter") {
      if(this.searchQuery && this.searchQuery.length > 0) {
        this.pageNumber = 1;
        this.clientService.getClients(this.pageNumber, this.limit, this.searchField + "=" + this.searchQuery).subscribe(
          data => {
            this.clients = data.clients;
            this.hasMorePages = data.has_more;
          }
        );
      }
      else{
        this.pageNumber = 1;
        this.getClients();
      }
    }
  }
}
