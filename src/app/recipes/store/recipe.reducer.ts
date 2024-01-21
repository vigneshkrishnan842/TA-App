import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import * as recipeActions from "../store/recipe.actions";

export interface State {
    recipes:Recipe[];
}

const initialState : State = {
    recipes:[]
}

export const recipeReducer = createReducer(
    initialState,
    on(recipeActions.setRecipes, (state,action) => (
        {
            ...state,
            recipes:[...action.recipes]
        }
    )),
    on(recipeActions.addRecipe, (state,action) => (
        {
            ...state,
            recipes: [...state.recipes,action.recipe]
        }
    )),
    on(recipeActions.updateRecipe, (state,action) => {
        const updatedRecipe = {
            ...state.recipes [action.index],
            ...action.newRecipe
        };

        const updatedRecipes = [...state.recipes];
        updatedRecipes[action.index] = updatedRecipe;
        return {
            ...state,
            recipes:updatedRecipes
        }
        
    }),
    on(recipeActions.deleteRecipe, (state,action) => (
        {
            ...state,
            recipes:state.recipes.filter((recipe,index) => {
                return index !== action.index;
            })
        }
    ))
);