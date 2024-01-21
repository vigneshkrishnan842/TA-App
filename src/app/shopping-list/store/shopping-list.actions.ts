import {createAction, props} from '@ngrx/store';
import { Ingredient } from "../../Shared/ingredient.model";

export const addIngredient = createAction(
    '[Shopping-List] addIngredient',
    props <{ingredient : Ingredient}>()
);

export const addIngredients = createAction(
    '[Shopping-List] addIngredients',
    props<{ingredients : Ingredient[]}>()
);

export const updateIngredient = createAction(
    '[Shopping-List] updateIngredient',
    props<{ingredient : Ingredient}>()
);

export const deleteIngredient = createAction(
    '[Shopping-List] deleteIngredient',
);

export const startEdit = createAction(
    '[Shopping-List] startEdit',
    props <{index : number}>()
);

export const stopEdit = createAction(
    '[Shopping-List] stopEdit'
);