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

const TAB_NAME = configuratorTabs.debug;

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const DebugTabPanel = ({ selected }) => (
  <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
    <KnobTabPanelContent>
      <TabSection>
        <RenderKnob internalName="debug_hardware" />
        <RenderKnob internalName="performance_counters" />
        <RenderKnob internalName="instruction_trace" />
      </TabSection>
      <TabSection title="Trace Encoder">
        <RenderKnob internalName="has_trace_encoder" />
      </TabSection>
    </KnobTabPanelContent>
  </TabPanelWrapper>
);

DebugTabPanel.propTypes = {
  selected: PropTypes.bool,
};

DebugTabPanel.defaultProps = {
  selected: false,
};

DebugTabPanel.tabsRole = "TabPanel";

export default DebugTabPanel;
