import { UPDATE_WEB_CONFIG, UPDATE_KNOB_MAP } from "../actionTypes";

/*
  Reducers describe how the Redux state should change in response
  to actions. For each action "type" there is a case statement
  that does whatever logic is necessary with the payload and returns
  an object representing what the updated state should look like.

  https://redux.js.org/basics/reducers
*/

const initialState = {
  webConfig: {},
  knobMap: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_WEB_CONFIG: {
      const webConfig = action.payload;
      return {
        ...state,
        ...webConfig,
      };
    }

    case UPDATE_KNOB_MAP: {
      const knobMap = action.payload;
      return {
        ...state,
        ...knobMap,
      };
    }

    default:
      return state;
  }
};
