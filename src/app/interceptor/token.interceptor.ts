// src/app/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {HttpResponse} from "@capacitor/core";
import {Router} from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('auth_token');

    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(clonedRequest).pipe(
        catchError((error: HttpResponse) => {
          if (error.status === 401) {
            // Token inválido ou expirado
            localStorage.removeItem('token'); // ou sessionStorage, se for o caso
            this.router.navigate(['/login']);
          }

          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }
}
