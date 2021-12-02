import React from "react";
import renderer from "react-test-renderer";
import Clickwrap from "components/Clickwrap";

const ClickWrapUntyped = Clickwrap;

jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: jest.fn((element) => element),
}));

test("Can render Clickwrap component", () => {
  const component = renderer.create(
    <ClickWrapUntyped
      isOpen
      onModalClose={() => {}}
      countryChoices={[
        ["ASG", "Asgard"],
        ["JOT", "Jotunheim"],
        ["VRM", "Vormir"],
        ["XAN", "Xandar"],
        ["ZNW", "Zen-Whoberi"],
      ]}
      userCountryLabel="Jotunheim"
      userCountryValue="JOT"
      userCompany="BigOrg1"
    />
  );
  expect(component.toJSON().children.length).toBeGreaterThan(0);
});
