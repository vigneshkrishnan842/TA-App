import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../Shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription,Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as ShoppingListActions from "./store/shopping-list.actions";
import * as fromApp from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable <{ingredients : Ingredient[]}>;
  private igChangeSub:Subscription;

  constructor(private slService:ShoppingListService, private store : Store <fromApp.AppState>){}
  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients=this.slService.getIngredients();
    // this.igChangeSub=this.slService.ingredientsChanged.subscribe(
    //   (ingredients:Ingredient[]) =>{
    //     this.ingredients=ingredients;
    //   }
    // );
  }
  onEditItem(index:number){
    //this.slService.startedEditing.next(index);
    this.store.dispatch(ShoppingListActions.startEdit({index : index}));
  }

  ngOnDestroy(): void {
    //this.igChangeSub.unsubscribe();
  }
}
