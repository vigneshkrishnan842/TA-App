import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as authActions from "../store/auth.actions";
import { catchError, of, switchMap,map, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment.development";
import { Injectable } from "@angular/core";
import { Route, Router } from "@angular/router";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponseData{
    idToken:string;
    email:string;
    refreshToken:string;
    expiresIn:string;
    localId:string;
    registered ?:boolean;
}

const handleAuthentication = (expiresIn:number, email:string, userId:string, token:string) => {
const expirationDate = new Date(new Date().getTime() + + expiresIn * 1000);
const user = new User(email, userId, token, expirationDate);
localStorage.setItem('userData', JSON.stringify(user));
return authActions.login({email:email, userId:userId, token: token, expirationDate:expirationDate, redirect:true});
}

const handleError = (errorRes : any) => {
    let errorMessage = 'An unknown error occured!';
    if(!errorRes.error || !errorRes.error.error){
        return of(authActions.login_fail({message:errorMessage}));
    }
    switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS': errorMessage = 'This email already exists';
        break;
        case 'EMAIL_NOT_FOUND': errorMessage = 'This email does not exist';
        break;
        case 'INVALID_PASSWORD' : errorMessage = 'This password is not correct';
    }

    return of(authActions.login_fail({message:errorMessage}));
}

@Injectable()
export class authEffects {

    authSignup = createEffect( () => 
    this.actions$.pipe(
        ofType(authActions.signup_start),
        switchMap(signupAction => {
            return this.http.post <AuthResponseData> ('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebaseAPIKey,
                {
                    email: signupAction.email,
                    password : signupAction.password,
                    returnSecureToken : true
                }).pipe(tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000);
                }),
                map(resData => {
                    return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
                }
                ),catchError(errorRes => {
                    return handleError(errorRes);
                }));
            })
        )
    );

    authLogin = createEffect(() => 
    this.actions$.pipe(
    ofType(authActions.login_start),
     switchMap((authData) => {
        return this.http.post <AuthResponseData> ('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +environment.firebaseAPIKey,
        {
            email: authData.email,
            password : authData.password,
            returnSecureToken : true
        }).pipe(tap(resData => {
            this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),map((resData) => {
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }),catchError(errorRes => {
            return handleError(errorRes);
        }));
     }),
    )
    );

    authRedirect = createEffect( () => 
        this.actions$.pipe(
            ofType(authActions.login),
            tap((authSuccessAction) => {
                if(authSuccessAction.redirect){
                this.router.navigate(['/']);
                }
            })
        ),
        {dispatch:false}
    );

    authLogout = createEffect( () => 
        this.actions$.pipe(
            ofType(authActions.logout),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        )
    );

    autoLogin = createEffect( () => 
    this.actions$.pipe(
        ofType(authActions.autoLogin),
        map(() => {
            const userData : {email : string, id:string, _token:string, _tokenExpirationDate:string} 
            = JSON.parse(localStorage.getItem('userData'));
            if(!userData){
                return {type : 'Dummy'};
            }
            const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
            if(loadedUser.token){
                //this.user.next(loadedUser);
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime()-new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return (authActions.login({email:loadedUser.email, userId: loadedUser.id, token : loadedUser.token,expirationDate:new Date(userData._tokenExpirationDate),redirect:false}));
                //this.autoLogOut(expirationDuration);
            }
            return {type : 'Dummy'};
        })
    )
    );

    constructor(private actions$:Actions, private http:HttpClient, private router : Router, private authService : AuthService){}
}