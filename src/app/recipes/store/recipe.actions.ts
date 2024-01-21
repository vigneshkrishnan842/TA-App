import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export const setRecipes = createAction(
    '[recipes] setRecipes',
    props <{recipes:Recipe[]}> ()
);

export const fetchRecipes = createAction(
    '[recipes] fetchRecipes'
);

export const addRecipe = createAction(
    '[recipes] addRecipe',
    props <{recipe : Recipe}> ()
);

export const updateRecipe = createAction(
    '[recipes] updateRecipe',
    props <{index : number, newRecipe : Recipe}> ()
);

export const deleteRecipe = createAction(
    '[recipes] deleteRecipe',
    props <{index : number}> ()
);

export const storeRecipes = createAction(
    '[recipes] storeRecipes'
);