import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { User } from './user.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "/api/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [];

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
        console.log(error.error);
      }
      // return an observable with a user-facing error message
      return throwError('Something bad happened; please try again later.');
    };

  private extractBooksData(res: Response) {
    var body = res;
    let frontEndUser: User[] = [];
    for(let user of body['data']) {
      frontEndUser.push(new User(user.username, user.password, user.admin, user._id));
    }
    this.users = frontEndUser;
    return {users: frontEndUser, has_more: body['has_more']} || { };
  }

  getUsers(pageNumber: number, limit: number): Observable<any> {
    if(pageNumber) {
      return this.http.get(apiUrl + "?page=" + pageNumber + "&limit=" + limit, httpOptions).pipe(
        map(this.extractBooksData),
        catchError(this.handleError)
      );
    }
  }

  getUser(id: string) {
    return this.http.get(apiUrl + "/" + id, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  addUser(user: User) {
    const body = JSON.stringify(user);
    return this.http.post(apiUrl, body, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  deleteUser(id: string) {
    return this.http.delete(apiUrl + "/" + id).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(user: User) {
    return this.http.patch(apiUrl + "/" + user.id, JSON.stringify(user) ,httpOptions).pipe(
      catchError(this.handleError)
    );
  }
}
