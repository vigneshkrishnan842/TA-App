import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../Shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";
import { Store } from "@ngrx/store";
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService{
  recipesChanged = new Subject<Recipe[]>();

    // private recipes:Recipe[]=[
    //     new Recipe('A Test Recipe',
    //     'This is simply a test',
    //     'https://pipingpotcurry.com/wp-content/uploads/2020/11/Dosa-recipe-plain-sada-dosa-Piping-Pot-Curry.jpg',
    //     [
    //         new Ingredient('batter',1),
    //         new Ingredient('chutney',1)
    //     ]),
    //     new Recipe('Another Test Recipe',
    //     'This is simply a test',
    //     'https://pipingpotcurry.com/wp-content/uploads/2020/11/Dosa-recipe-plain-sada-dosa-Piping-Pot-Curry.jpg',
    //     [
    //         new Ingredient('batter',1),
    //         new Ingredient('chutney',1)
    //     ])
    //   ];
    private recipes : Recipe [] = [];

      constructor(private slService: ShoppingListService, 
        private store : Store <fromApp.AppState>){}

      setRecipes(recipes : Recipe []){
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
      }
      
      getRecipes(){
        return this.recipes.slice();
      }
      getRecipe(index:number){
        return this.recipes[index];
      }

      addIngredientsToShoppingList(ingredients:Ingredient[]){
        //this.slService.addIngredients(ingredients);
        this.store.dispatch(ShoppingListActions.addIngredients({ingredients : ingredients}));
      }

      addRecipe(recipe:Recipe){
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
      }

      updateRecipe(index:number, newRecipe:Recipe){
        this.recipes[index]=newRecipe;
        this.recipesChanged.next(this.recipes.slice());
      }

      deleteRecipe(index:number){
        this.recipes.splice(index,1);
        this.recipesChanged.next(this.recipes.slice());
      }
}