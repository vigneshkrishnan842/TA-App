import { Component, ComponentFactoryResolver, OnDestroy, ViewChild,OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthResponseData, AuthService } from "./auth.service";
import { Observable, Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AlertComponent } from "../Shared/alert/alert.component";
import { PlaceholderDirective } from "../Shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as authActions from "../Auth/store/auth.actions";

@Component({
    selector : 'app-auth',
    templateUrl : './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error : string = null;
    @ViewChild(PlaceholderDirective,{static:false}) alertHost : PlaceholderDirective;
    private closeSub : Subscription;
    private storeSub : Subscription;

    constructor(private authService : AuthService, private router : Router, private companyFactoryResolver : ComponentFactoryResolver, private store : Store <fromApp.AppState>){}

    ngOnInit(): void { 
        this.storeSub=this.store.select('auth').subscribe(authState => {
            this.isLoading=authState.loading;
            this.error=authState.authError;
            if(this.error){
                this.showErrorAlert(this.error);
            }
        });
    }

    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit( form: NgForm){
        if(!form.valid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;


        if(this.isLoginMode){
            //authObs=this.authService.login(email,password);
            this.store.dispatch(authActions.login_start({email:email,password:password}));
        } else{
            this.store.dispatch(authActions.signup_start({email:email, password:password}));
    }

    // authObs.subscribe(resData => {
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    // }, errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.showErrorAlert(errorMessage);
    //     this.isLoading = false;
    // });
        form.reset();
    }

    onHandleError(){
        this.store.dispatch(authActions.clear_error());
    }

    private showErrorAlert(message:string){
       const alertCmpFactory = this.companyFactoryResolver.resolveComponentFactory(AlertComponent);
       const hostViewContainerRef = this.alertHost.viewContainerRef;
       hostViewContainerRef.clear();
       const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
       componentRef.instance.message = message;
       this.closeSub = componentRef.instance.close.subscribe(() => {
        this.closeSub.unsubscribe();
        hostViewContainerRef.clear();
       });
    }

    ngOnDestroy(): void {
        if(this.closeSub){
            this.closeSub.unsubscribe();
        }
        if(this.storeSub){
            this.storeSub.unsubscribe();
        }
    }

}