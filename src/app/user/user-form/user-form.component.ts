import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  createForm: FormGroup;
  user: User;
  editMode: boolean = false;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.createForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        this.whiteSpaceValidator
      ]),
      password: new FormControl('', [
        Validators.required,
        this.whiteSpaceValidator
      ]),
      admin: new FormControl(false);
    });
    this.route.params.subscribe(
      params => {
        if(params['id']) {
          this.editMode = true;
          this.userService.getUser(params['id']).subscribe(
            data => {
              this.createForm.setValue({
                username: data.username,
                password: data.password,
                admin: data.admin
              });
              this.user = new User(data.username, data.password, data.admin, data._id);
            }
          );
        }
      }
    );
  }

  onSubmit() {
    if(!this.editMode) {
      this.userService.addUser(new User(this.createForm.value.username, this.createForm.value.password, this.createForm.value.admin))
      .subscribe(
        data => console.log(data);
      );
    }
    else
    {
      this.userService.updateUser(new User(this.createForm.value.username, this.createForm.value.password, this.createForm.value.admin, this.user.id))
      .subscribe(
        data => console.log(data);
      );
    }
    this.router.navigateByUrl('/user');
  }

  whiteSpaceValidator(control: FormControl) {
    let value = control.value;
    if(value.indexOf(' ') !== -1) {
      return {
        containsSpaces: value
      }
    }
    return null;
  }
}
