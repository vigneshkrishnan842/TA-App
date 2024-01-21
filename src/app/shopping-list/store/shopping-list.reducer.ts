import { createReducer, on } from "@ngrx/store";
import { Ingredient } from "../../Shared/ingredient.model";
import * as ShoppingListActions from './shopping-list.actions';

export interface State {
  ingredients : Ingredient[];
  editedIngredient : Ingredient;
  editedIngredientIndex : number;
}

const initialState : State= {
    ingredients :[
        new Ingredient('Apples',5),
        new Ingredient('Tomatoes',10)
      ],
      editedIngredient : null,
      editedIngredientIndex : -1
};

export const shoppingListReducer = createReducer(
    initialState,
  on(ShoppingListActions.addIngredient, (state,action) => (
    {
        ...state,
        ingredients : [...state.ingredients, action.ingredient]
    }
  )
),
on(ShoppingListActions.addIngredients, (state,action) => (
  {
    ...state,
    ingredients: [...state.ingredients,...action.ingredients]
  }
)),
on(ShoppingListActions.updateIngredient,(state,action) => {
  const ingredient = state.ingredients[state.editedIngredientIndex];
  const updatedIngredient ={
    ...ingredient,
    ...action.ingredient
  };
  const updatedIngredients = [...state.ingredients];
  updatedIngredients[state.editedIngredientIndex]=updatedIngredient;

  return {
    ...state,
    ingredients : updatedIngredients,
    editedIngredient:null,
    editedIngredientIndex:-1
  };
}),
on(ShoppingListActions.deleteIngredient, (state,action) => (
{
  ...state,
  ingredients: state.ingredients.filter((ig, igindex) => {
    return igindex !== state.editedIngredientIndex;
  }),
  editedIngredient:null,
  editedIngredientIndex:-1
})
),
on(ShoppingListActions.startEdit, (state,action) =>(
  {
    ...state,
    editedIngredientIndex:action.index,
    editedIngredient:{...state.ingredients[action.index]}
  }
)),
on(ShoppingListActions.stopEdit, (state) => (
  {
    ...state,
    editedIngredientIndex:-1,
    editedIngredient : null
  }
))
);