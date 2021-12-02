import { UPDATE_WEB_CONFIG, UPDATE_KNOB_MAP } from "./actionTypes";

/*
  An "action" is an object that tells the store how it should change.
  It consists of a "type" (which should be imported from ./actionTypes)
  and a "payload", which gives the reducer the data it needs to perform
  the desired state change.

  The functions below are action creators -- connected components can
  call them with props.dispatch() to send updates to the store.

  Ex: this.props.dispatch(updateWebConfig(this.state.design))

  https://redux.js.org/basics/actions
  https://react-redux.js.org/api/connect

*/

// Helpers

const updateWebConfigAction = (webConfig) => ({
  type: UPDATE_WEB_CONFIG,
  payload: {
    webConfig,
  },
});

// Takes in a webConfig and a dict of changed key/value pairs, returns an updated config
const createUpdatedConfig = (webConfig, newDictValues) => {
  const newConfig = { ...webConfig, ...newDictValues };
  return newConfig;
};

// Actions

export const updateKnobMap = (knobMap) => ({
  type: UPDATE_KNOB_MAP,
  payload: {
    knobMap,
  },
});

// This is a redux-thunk action that will create an updated webConfig, then update the redux state
// Should be used instead of dispatching the updateWebConfig action directly
export const updateWebConfig = (webConfig, newDictValues) => (dispatch) => {
  const newConfig = createUpdatedConfig(webConfig, newDictValues);
  return dispatch(updateWebConfigAction(newConfig));
};
