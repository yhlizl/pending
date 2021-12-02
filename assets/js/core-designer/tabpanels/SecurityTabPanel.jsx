import React from "react";
import PropTypes from "prop-types";

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

const TAB_NAME = configuratorTabs.security;

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const SecurityTabPanel = ({ selected }) => (
  <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
    <PanelContent />
  </TabPanelWrapper>
);

SecurityTabPanel.propTypes = {
  selected: PropTypes.bool,
};

SecurityTabPanel.defaultProps = {
  selected: false,
};

SecurityTabPanel.tabsRole = "TabPanel";

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

const PanelContent = () => (
  <KnobTabPanelContent>
    <TabSection>
      <RenderKnob internalName="has_pmp" />
      <RenderKnob internalName="hasDisableDebug" />
      <RenderKnob internalName="has_ppd" />
      <RenderKnob internalName="has_hca" />
    </TabSection>
  </KnobTabPanelContent>
);

export default SecurityTabPanel;
