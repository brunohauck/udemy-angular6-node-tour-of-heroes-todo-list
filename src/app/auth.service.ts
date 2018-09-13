import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of  } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

@Injectable()
export class AuthService{
    
    constructor(
        private http: HttpClient,
        private messageService: MessageService){

         }

    login(username: string, password: string): Observable<boolean>{
        return this.http.post<{token: string}>(
            '/api/auth', {username: username, password: password})
            .pipe(
                tap(_ => this.log(`Login`)),
                catchError(this.handleError<any>('Toke Error')),
                map(result =>{
                    localStorage.setItem('access_token', result.token);
                    console.log("sucesso");
                    console.log(result.token);
                    return true;
                }),                                            
        );
    }
    logout(){
        localStorage.removeItem('access_token');
    }
    public get loggedIn(): boolean {
        return (localStorage.getItem('access_token') != null );
    }
      /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
    
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
    
        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);
    
        // Let the app keep running by returning an empty result.
        return of(result as T);
        };
    }
    private log(message: string) {
        this.messageService.add(`HeroService: ${message}`);
    }    
}