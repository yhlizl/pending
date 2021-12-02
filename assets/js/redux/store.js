import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";

/*
  The Redux store is what holds the state. It's made up of
  reducers that define how the state responds to updates.

  All of our reducers are combined in ./reducers, so this
  file should not need updating unless we're adding middleware.

  https://redux.js.org/basics/store
*/

export const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

/*
  getWebConfig() can be imported and used by non-component functions
  to retrieve a copy of the latest web config. This copy will NOT stay
  up to date with any changes. ONLY use when accessing state by way of
  connected components is impossible/impractical.
*/
export const getWebConfig = () => store.getState().coreDesigner.webConfig;
