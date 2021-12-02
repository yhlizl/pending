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

const TAB_NAME = configuratorTabs.rtlOptions;

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //
const RTLOptionsTabPanel = ({ selected, ipSeries }) => (
  <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
    <PanelContent ipSeries={ipSeries} />
  </TabPanelWrapper>
);

RTLOptionsTabPanel.propTypes = {
  selected: PropTypes.bool,
  ipSeries: PropTypes.string.isRequired,
};

RTLOptionsTabPanel.defaultProps = {
  selected: false,
};

RTLOptionsTabPanel.tabsRole = "TabPanel";

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

const PanelContent = () => (
  <KnobTabPanelContent>
    <TabSection title="The default prefix is 'SiFive_'">
      <RenderKnob internalName="has_rtlPrefix" />
    </TabSection>
  </KnobTabPanelContent>
);

export default RTLOptionsTabPanel;
