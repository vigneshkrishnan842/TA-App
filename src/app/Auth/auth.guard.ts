import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "./auth.service";
import * as fromApp from "../store/app.reducer";
import { Store } from "@ngrx/store";

@Injectable({providedIn : 'root'})
export class AuthGuard implements CanActivate{

    constructor(private authService : AuthService, private router : Router, private store : Store <fromApp.AppState>){}
    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
     return this.store.select('auth').pipe(take(1),map(authData => {return authData.user}),map(user => {
        const isAuth = !!user;  //returns true for any non-null values of user and false for undefined or null values
        if(isAuth){
            return true;
        }
        return this.router.createUrlTree(['/auth']);
     
    }), 
    //  tap (isAuth => {
    //     if(!isAuth){
    //         this.router.navigate(['/auth']);
    //     }
    //  })
     );   
    }
}