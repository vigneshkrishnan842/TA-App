import { Component,Input, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from "../../store/app.reducer";
import { map, switchMap } from 'rxjs';
import * as recipesActions from "../store/recipe.actions";
import * as shoppingListActions from "../../shopping-list/store/shopping-list.actions";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
 recipe:Recipe;
 id:number;
 constructor(private recipeService:RecipeService, private route: ActivatedRoute, private router:Router, private store : Store<fromApp.AppState>){}

 onAddToShoppingList(){
  //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  this.store.dispatch(shoppingListActions.addIngredients({ingredients:this.recipe.ingredients}));
 }

 ngOnInit(): void {
   this.route.params.pipe(map(params => {
    return +params['id'];
   }),switchMap(id => {
    this.id=id;
    return this.store.select('recipes');
   }),(map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index===this.id;
        })
      }))).subscribe(recipe => {
        this.recipe=recipe;
      });
    }

 onEditRecipe(){
  this.router.navigate(['edit'],{relativeTo:this.route});
  //this.router.navigate(['../',this.id,'edit'],{relativeTo:this.route});
 }

 onDeleteRecipe(){
  //this.recipeService.deleteRecipe(this.id);
  this.store.dispatch(recipesActions.deleteRecipe({index:this.id}));
  this.router.navigate(['/recipes']);
 }
}
