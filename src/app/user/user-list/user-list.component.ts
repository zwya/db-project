import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[];
  private pageNumber: number;
  private limit: number;
  private hasMorePages: boolean;
  private hoverIndex: number;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.pageNumber = 1;
    this.limit = 10;
    this.getUsers();
    this.hoverIndex = null;
  }

  nextPage() {
    if(this.hasMorePages) {
      this.pageNumber++;
      this.getUsers();
    }
  }

  previousPage() {
    if(this.pageNumber > 1) {
      this.pageNumber--;
      this.getUsers();
    }
  }

  getUsers() {
    this.userService.getUsers(this.pageNumber, this.limit).subscribe(
      data => {
        this.users = data.users;
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
    this.router.navigateByUrl('/user/details/' + this.users[this.hoverIndex].id);
  }

}
