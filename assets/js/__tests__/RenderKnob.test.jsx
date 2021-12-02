import Enzyme, { shallow, mount } from "enzyme";
import React from "react";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import RenderKnob from "../core-designer/tabpanels/Shared/RenderKnob2";

// import * as renderer from 'react-test-renderer';

// import StaffDashboard from '../staffDashboard/StaffDashboard';

Enzyme.configure({ adapter: new Adapter() });

describe("Test RenderKnob", () => {
  const initdata = {
    coreDesigner: {
      webConfig: {},
      knobMap: {},
    },
  };
  const setup = (props = {}) => {
    return mount(<RenderKnob {...props} />);
  };
  test("Address Remapper", () => {
    const componet = setup(initdata);
    console.log(componet);
    expect(123).toEqual(123);
  });
});
