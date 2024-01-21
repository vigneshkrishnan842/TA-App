import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from "../recipes/recipe.service";
import { Recipe } from "../recipes/recipe.model";
import { exhaustMap, map, take, tap } from "rxjs";
import { AuthService } from "../Auth/auth.service";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";
import * as recipesActions from "../recipes/store/recipe.actions";

@Injectable({providedIn : 'root'})
export class DataStorageService {
    constructor( private http : HttpClient, private recipeService : RecipeService, private authService : AuthService, 
        private store:Store <fromApp.AppState>){}

    storeRecipes(){
        console.log("Inside storeRecipes");
        const recipes = this.recipeService.getRecipes();
        this.http.put('https://ng-course-recipe-book-8761a-default-rtdb.firebaseio.com/recipes.json', recipes)
        .subscribe(response => {
            console.log(response);
        })
    }

    fetchRecipes(){
        
            return this.http.get <Recipe[]> ('https://ng-course-recipe-book-8761a-default-rtdb.firebaseio.com/recipes.json')
            .pipe(map(recipes => {
            return recipes.map(recipe => {
                return {...recipe, ingredients : recipe.ingredients ? recipe.ingredients : []};
            });
        }),
        tap(recipes => {
            //this.recipeService.setRecipes(recipes);
            this.store.dispatch(recipesActions.setRecipes({recipes:recipes}));
        }));   
    }
}