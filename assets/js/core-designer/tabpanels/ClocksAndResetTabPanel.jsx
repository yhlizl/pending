import React from "react";
import PropTypes from "prop-types";

import { UnreachableCaseError } from "utils/TypeUtilities";

import { configuratorTabs } from "../Constants";
import { KnobTabPanelContent } from "../ConfiguratorStyles";
import RenderKnob from "./Shared/RenderKnob";
import { TabPanelWrapper } from "./TabPanelWrapper";
import { Checklist, TabSection } from "./Shared/Components";

// ========================================================================== //
//                                                                            //
//                          Constants and Helpers                             //
//                                                                            //
// ========================================================================== //

const TAB_NAME = configuratorTabs.clocksAndReset;

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const ClocksAndResetTabPanel = ({ selected, ipSeries }) => (
  <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
    <PanelContent ipSeries={ipSeries} />
  </TabPanelWrapper>
);

ClocksAndResetTabPanel.propTypes = {
  selected: PropTypes.bool,
  ipSeries: PropTypes.string.isRequired,
};

ClocksAndResetTabPanel.defaultProps = {
  selected: false,
};

ClocksAndResetTabPanel.tabsRole = "TabPanel";

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

const PanelContent = ({ ipSeries }) => {
  switch (ipSeries) {
    case "E2":
    case "S2":
      return <CaboosePanelContent />;
    case "E3":
    case "S5":
    case "U5":
    case "E6":
    case "E7":
    case "S7":
    case "U7":
      return <RocketBulletPanelContent />;
    default:
      throw new UnreachableCaseError(ipSeries);
  }
};

PanelContent.propTypes = {
  ipSeries: PropTypes.string.isRequired,
};

const CaboosePanelContent = () => (
  <KnobTabPanelContent>
    <TabSection>
      <Checklist>
        <RenderKnob internalName="clock_gating" />
        <RenderKnob internalName="has_separate_reset" />
        <RenderKnob internalName="reset_scheme" />
      </Checklist>
    </TabSection>
  </KnobTabPanelContent>
);

const RocketBulletPanelContent = () => (
  <KnobTabPanelContent>
    <TabSection>
      <Checklist>
        <RenderKnob internalName="clock_gating" />
        <RenderKnob internalName="reset_scheme" />
      </Checklist>
    </TabSection>
  </KnobTabPanelContent>
);

export default ClocksAndResetTabPanel;
