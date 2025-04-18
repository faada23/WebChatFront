import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.Service";
import { catchError, of, throwError } from "rxjs";
import { Router } from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const router = inject(Router);

    return next(req).pipe(
        catchError(error => {
            if (error.status == 401) {
                router.navigate(['/login'])
            }

            return throwError(() => error);
        })
    );
}