import React from "react";
import PropTypes from "prop-types";

import { UnreachableCaseError } from "utils/TypeUtilities";

import { configuratorTabs } from "../Constants";
import { KnobTabPanelContent } from "../ConfiguratorStyles";
import RenderKnob from "./Shared/RenderKnob";
import { TabPanelWrapper } from "./TabPanelWrapper";
import { TabSection } from "./Shared/Components";

// ========================================================================== //
//                                                                            //
//                          Constants and Helpers                             //
//                                                                            //
// ========================================================================== //

const TAB_NAME = configuratorTabs.branchPrediction;
const TOOLTIP = `Allocates more resources to different predictive structures
related to branches in the instruction fetch frontend.`;

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const BranchPredictionTabPanel = ({ selected, ipSeries }) => (
  <TabPanelWrapper tabName={TAB_NAME} selected={selected} tooltip={TOOLTIP}>
    <PanelContent ipSeries={ipSeries} />
  </TabPanelWrapper>
);

BranchPredictionTabPanel.propTypes = {
  selected: PropTypes.bool,
  ipSeries: PropTypes.string.isRequired,
};

BranchPredictionTabPanel.defaultProps = {
  selected: false,
};

BranchPredictionTabPanel.tabsRole = "TabPanel";

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

// todo 6 series needs a new pellet panel?
const PanelContent = ({ ipSeries }) => {
  switch (ipSeries) {
    case "E2":
    case "S2":
      throw new Error(`Branch Prediction panel doesn't exist for ${ipSeries}`);
    case "E3":
    case "S5":
    case "U5":
      return <RocketPanelContent />;
    case "E6":
    case "E7":
    case "S7":
    case "U7":
      return <BulletPanelContent />;
    default:
      throw new UnreachableCaseError(ipSeries);
  }
};

PanelContent.propTypes = {
  ipSeries: PropTypes.string.isRequired,
};

const RocketPanelContent = () => (
  <KnobTabPanelContent>
    <TabSection>
      <RenderKnob internalName="btb_entries" />
      <RenderKnob internalName="bht_entries" />
      <RenderKnob internalName="ras_entries" />
    </TabSection>
  </KnobTabPanelContent>
);

const BulletPanelContent = () => (
  <KnobTabPanelContent>
    <TabSection>
      <RenderKnob internalName="bp_optim" />
    </TabSection>
  </KnobTabPanelContent>
);

export default BranchPredictionTabPanel;
