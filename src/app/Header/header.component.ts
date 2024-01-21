import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import { DataStorageService } from '../Shared/data-storage.service';
import { AuthService } from '../Auth/auth.service';
import { Subscription, map } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from "../store/app.reducer";
import * as authActions from "../Auth/store/auth.actions";
import * as recipeActions from "../recipes/store/recipe.actions";

@Component({
selector:'app-header',
templateUrl:'./header.component.html'

})
export class HeaderComponent implements OnInit, OnDestroy{
    isAuthenticated = false;
    private userSub : Subscription;

    constructor(private dataStorageService : DataStorageService, private authService : AuthService, private store : Store<fromApp.AppState>){}

    ngOnInit(): void {
        this.store.select('auth').pipe(map(authState => {return authState.user})).subscribe(user => {
            this.isAuthenticated = !user ? false : true;
        });
    }
    @Output() featureSelected=new EventEmitter<string>();
    onSelect(feature:string){
        this.featureSelected.emit(feature);
    }

    onSaveData(){
        //this.dataStorageService.storeRecipes();
        this.store.dispatch(recipeActions.storeRecipes());
    }

    onFetchData(){
        //this.dataStorageService.fetchRecipes().subscribe();
        this.store.dispatch(recipeActions.fetchRecipes());
    }

    onLogOut(){
        //this.authService.logout();
        this.store.dispatch(authActions.logout());
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }
}