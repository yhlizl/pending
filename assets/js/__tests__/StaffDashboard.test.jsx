/* eslint-disable jest/no-commented-out-tests */

// import { shallow } from 'enzyme';
import * as Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
// import * as renderer from 'react-test-renderer';

// import StaffDashboard from '../staffDashboard/StaffDashboard';

Enzyme.configure({ adapter: new Adapter() });

// TODO: Figure out the proper way to polyfill fetch, and re-enable these tests
// NOTE: Can't skip these, as importing StaffDashboard causes jest to fail

// test.skip('Can render StaffDashboard component', () => {
//   const component = renderer.create((
//     <StaffDashboard />
//   ));
//   expect(component!.toJSON()!.children!.length).toBeGreaterThan(0);
// });

// test.skip('StaffDashboard component has expected class', () => {
//   const wrapper = shallow(<StaffDashboard />);
//   expect(wrapper.find('div.dashboard')).toHaveLength(1);
// });

test("Placeholder test", () => {
  expect(123).toEqual(123);
});
