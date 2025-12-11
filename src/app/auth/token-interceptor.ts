import { HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem('token');
  const router = inject(Router);  // inject Router to navigate

  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log('Response received for', req.url);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or unauthorized access
        console.warn('Unauthorized - token might be expired');

        // Remove invalid token from storage
        localStorage.removeItem('token');

        // Redirect to login page (adjust route as needed)
        router.navigate(['/login']);

        // Optionally: show a toast or alert here
        alert('Session expired. Please log in again.');

        // Optionally: you could return EMPTY here if you want to swallow the error:
        // return EMPTY;

        // Or rethrow the error to propagate it further:
        return throwError(() => error);
      }
      return throwError(() => error);
    })
  );
}
