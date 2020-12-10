import {
    ContentsComponent
} from "./Contents"
import {
    connect
} from "react-redux"
import Store, {
    RootState
} from "../ReduxStore"
import { MealPeriod, MealType, changeMealType, changeMealPeriod, changeMeal } from "../reducers/HallNumberReducer"
import {
    Communicator
} from "../data/Communicator"

export const ContentsContainer = connect(
    (state : RootState) => ({
        currentHallNumber : state.hallNumberReducer.currentHallNumber,
        currentMealType : state.hallNumberReducer.currentMealType,
        currentMealPeriod : state.hallNumberReducer.currentMealPeriod,
        currentMeals : state.hallNumberReducer.currentMeals
    }),
    dispatch => ({
        onMealTypeChanged : async (mealType : MealType) => {
            dispatch(changeMealType(mealType))
            const currentHallState = Store.getState().hallNumberReducer
            const communicator = Communicator.getInstance()
            dispatch(changeMeal([]))
            dispatch(changeMeal(await communicator.getMeals(
                currentHallState.currentHallNumber,
                currentHallState.currentMealType,
                currentHallState.currentMealPeriod
            )))
        },
        onMealPeriodChanged : async (mealPeriod : MealPeriod) => {
            dispatch(changeMealPeriod(mealPeriod))
            const currentHallState = Store.getState().hallNumberReducer
            const communicator = Communicator.getInstance()
            dispatch(changeMeal([]))
            dispatch(changeMeal(await communicator.getMeals(
                currentHallState.currentHallNumber,
                currentHallState.currentMealType,
                currentHallState.currentMealPeriod
            )))
        }
    })
)(ContentsComponent)