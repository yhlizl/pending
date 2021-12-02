import { combineReducers } from "redux";
import coreDesigner from "./coreDesignerReducer";

/*
  Reducers describe how the Redux state should change in response
  to actions. It's helpful to have different reducers for different
  "categories" of state.

  Every time a new reducer is added, make sure you import it here
  and include it in `combineReducers()` below.
*/

export default combineReducers({ coreDesigner });
