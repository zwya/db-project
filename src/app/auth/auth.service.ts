import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { User } from '../user/user.model';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "/api/user/signin";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
    }

    signin(user: User) {
      const body = JSON.stringify(user);
      return this.http.post(apiUrl, body, httpOptions).pipe(
        catchError(this.handleError)
      );
    }

    logout() {
      localStorage.clear();
    }

    isLoggedIn() {
      return localStorage.getItem('token') !== null;
    }

    isAdmin() {
      if(localStorage.getItem('admin') && localStorage.getItem('admin') != 'false') {
        return true;
      }
      return false;
    }

}
