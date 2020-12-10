import {
    HallSelectorComponent
} from "./HallSelector"
import {
    connect
} from 'react-redux'
import {
    changeHallNumber, HallNumber, changeMeal
} from "../reducers/HallNumberReducer"
import Store, {
    RootState
} from "../ReduxStore"
import {
    Communicator
} from "../data/Communicator"

export const HallSelectorContainer = connect(
    (state : RootState) => ({
        currentHallNumber : state.hallNumberReducer.currentHallNumber
    }),
    dispatch => ({
        onSelected : async (hallNumber : HallNumber) => {
            dispatch(changeHallNumber(hallNumber))
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
)(HallSelectorComponent)