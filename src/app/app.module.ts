import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from  '@angular/common/http';
import { LoginModule } from './login/login.module';
import { SignupModule } from './signup/signup.module';
import { HomeModule } from './home/home.module';
import { ApiService } from './api.service';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private api: ApiService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
          console.warn("ERROR:", err);
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.api.logout();
                location.reload(true);
            }
            
            const error = err.error.message || err.statusText;

            this.api.loader();
            this.api.toast(error, 'danger');

            return throwError(error);
        }))
    }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    SignupModule,
    HomeModule
  ],
  providers: [
    ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [
    
  ]
})
export class AppModule { }
