import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as recipesActions from "../store/recipe.actions";
import { switchMap, withLatestFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipe.model";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromApp from "../../store/app.reducer";
import {map} from "rxjs/operators";

@Injectable()
export class recipeEffects {
    fetchRecipes = createEffect(() => 
    this.actions$.pipe(
        ofType(recipesActions.fetchRecipes),
        switchMap(() => {
            return this.http.get <Recipe[]> ('https://ng-course-recipe-book-8761a-default-rtdb.firebaseio.com/recipes.json');
        }), 
        map(recipes => {
            return recipes.map((recipe) => {
                return {
                    ...recipe,
                    ingredients:recipe.ingredients ? recipe.ingredients : []
                };
            });
        }),
        map(recipes => {
            return recipesActions.setRecipes({recipes:recipes});
        })
    )
    );

    storeRecipes = createEffect(() => 
    this.actions$.pipe(
        ofType(recipesActions.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
            return this.http.put('https://ng-course-recipe-book-8761a-default-rtdb.firebaseio.com/recipes.json',
            recipesState.recipes);
        })
    ),
    {dispatch:false}
    );


    constructor(private actions$ : Actions, private http:HttpClient, private store:Store <fromApp.AppState>){}
}