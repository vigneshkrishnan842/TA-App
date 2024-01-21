import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { DataStorageService } from "../Shared/data-storage.service";
import { RecipeService } from "./recipe.service";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as recipesActions from "./store/recipe.actions";
import { Actions, ofType } from "@ngrx/effects";
import { map, of, switchMap, take } from "rxjs";

@Injectable({providedIn : 'root'})
export class RecipesResolverService implements Resolve <Recipe[]>{
constructor(private dataStorageService : DataStorageService, private recipeService : RecipeService, 
    private store:Store <fromApp.AppState>, private actions$ : Actions ){
}

resolve(route : ActivatedRouteSnapshot, state : RouterStateSnapshot){
    //const recipes = this.recipeService.getRecipes();

    //if(recipes.length ===0){
    //return this.dataStorageService.fetchRecipes();
    return this.store.select('recipes').pipe(
    take(1),
    map(recipesState => {
        return recipesState.recipes;
    }),
    switchMap(recipes => {
        if(recipes.length===0){
            this.store.dispatch(recipesActions.fetchRecipes());
            return of([]);
        }else{
            return of(recipes);
        }
    }))
    
    //}else {
    //    return recipes;
    //}
}
}