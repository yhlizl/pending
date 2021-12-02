import thunk from "redux-thunk";

import configureMockStore from "redux-mock-store";
import rootReducer from "../redux/reducers";

import { updateKnobMap, updateWebConfig } from "../redux/actions";

const middlewares = [thunk];
const mockstore = configureMockStore(middlewares);

jest.mock("react-redux");

//   beforeEach(() => {
//     // mock 一個 store
//     store = mockStore(initialState);
//   });
// write auth action dispatcher testing here
describe("Actions Testing :", () => {
  let store = mockstore({
    coreDesigner: { webConfig: {}, knobMap: {} },
  });
  store.replaceReducer(rootReducer);
  beforeEach(() => {
    store = mockstore({
      coreDesigner: { webConfig: {}, knobMap: {} },
    });
  });
  test("UPDATE_KNOB_MAP", () => {
    const knobMap = new Map();

    knobMap.set("has_adr_remapr", "BooleanKnob");
    const dispatch = (item) => store.dispatch(item);
    dispatch(updateKnobMap(knobMap));

    expect(store.getActions()).toStrictEqual([
      {
        type: "UPDATE_KNOB_MAP",
        payload: { knobMap },
      },
    ]);
  });

  test("UPDATE_WEB_CONFIG", () => {
    const dispatch = (item) => store.dispatch(item);
    const oldone = { "old one": "1", "new one": "0" };
    const newone = { "old one": "0", "new one": "1" };
    dispatch(updateWebConfig(oldone, newone));
    console.log(store.getActions());
    expect(store.getActions()).toStrictEqual([
      {
        type: "UPDATE_WEB_CONFIG",
        payload: {
          webConfig: {
            "new one": "1",
            "old one": "0",
          },
        },
      },
    ]);
  });
});
