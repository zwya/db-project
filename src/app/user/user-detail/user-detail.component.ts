import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.userService.getUser(params['id']).subscribe(
          data => this.user = new User(data['username'], data['password'], data['admin'], data['_id'])
        );
      }
    );
  }

  deleteUser() {
    this.userService.deleteUser(this.user.id).subscribe(
      data => console.log(data)
    );
    this.router.navigateByUrl('/user');
  }
}
