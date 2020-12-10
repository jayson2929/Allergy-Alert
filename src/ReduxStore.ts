import {
    combineReducers, createStore, compose
} from 'redux'
import hallNumberReducer from "./reducers/HallNumberReducer"
const rootReducer = combineReducers({
    hallNumberReducer
})
const composEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export default createStore(rootReducer, composEnhancers())
export type RootState = ReturnType<typeof rootReducer>
