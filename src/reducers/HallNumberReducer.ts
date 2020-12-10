import { Meal } from "../data/Communicator"

export enum HallActionType {
    CHANGE = "hallNumber/change",
    CHANGE_MEAL_TYPE = "hallNumber/changeMealType",
    CHANGE_MEAL_PERIOD = "hallNumber/changeMealPeriod",
    CHANGE_MEAL = "hallNumber/changeMeal"
}
export enum HallNumber {
    HALL_1 = 1,
    HALL_2 = 2
}
export enum MealType {
    RAMEN = "ramen",
    WESTERN = "western",
    SNACK = "snack",
    KOREAN = "korean",
    JAPANESE = "japanese",
    CHINESE = "chinese"
}

export enum MealPeriod {
    LAUNCH = "CCS02.20", 
    LAUNCH_COURSE = "CCS02.40"
}
export const changeHallNumber = (hallNumber : HallNumber) : {type : HallActionType, hallNumber : HallNumber} => ({
    type : HallActionType.CHANGE,
    hallNumber : hallNumber
})
export const changeMealType = (mealType : MealType) : {type : HallActionType, mealType : MealType} => ({
    type : HallActionType.CHANGE_MEAL_TYPE,
    mealType : mealType
})
export const changeMealPeriod = (mealPeriod : MealPeriod) : {type : HallActionType, mealPeriod : MealPeriod} => ({
    type : HallActionType.CHANGE_MEAL_PERIOD,
    mealPeriod : mealPeriod
})
export const changeMeal = (meals : Meal[]) : {type : HallActionType, meals : Meal[]} => ({
    type : HallActionType.CHANGE_MEAL,
    meals : meals
})

type HallNumberAction = 
    ReturnType<typeof changeHallNumber>
    | ReturnType<typeof changeMealType>
    | ReturnType<typeof changeMealPeriod>

type HallNumberState = {
    currentHallNumber : HallNumber
    currentMealType : MealType
    currentMealPeriod : MealPeriod
    currentMeals : Meal[]
}

const initialiState : HallNumberState = {
    currentHallNumber : HallNumber.HALL_1,
    currentMealType : MealType.RAMEN,
    currentMealPeriod : MealPeriod.LAUNCH,
    currentMeals : []
}

export default function hallNumberReducer(state : HallNumberState = initialiState, action : HallNumberAction) {
    switch(action.type) {
        case HallActionType.CHANGE :
            return {...state, currentHallNumber : (action as any).hallNumber}
        case HallActionType.CHANGE_MEAL_TYPE :
            return {...state, currentMealType : (action as any).mealType}
        case HallActionType.CHANGE_MEAL_PERIOD :
            return {...state, currentMealPeriod :(action as any).mealPeriod}
        case HallActionType.CHANGE_MEAL :
            return {...state, currentMeals : (action as any).meals}
        default :
            return {...state}
    }
}