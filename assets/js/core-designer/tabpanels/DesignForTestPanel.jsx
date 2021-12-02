import React from "react";
import PropTypes from "prop-types";

import { configuratorTabs } from "../Constants";
import { KnobTabPanelContent } from "../ConfiguratorStyles";
import RenderKnob from "./Shared/RenderKnob";
import { Checklist, TabSection } from "./Shared/Components";
import { TabPanelWrapper } from "./TabPanelWrapper";

// ========================================================================== //
//                                                                            //
//                                  Constants                                 //
//                                                                            //
// ========================================================================== //

const TAB_NAME = configuratorTabs.designForTest;

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const DesignForTestPanel = ({ selected }) => (
  <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
    <PanelContent />
  </TabPanelWrapper>
);

DesignForTestPanel.propTypes = {
  selected: PropTypes.bool,
};

DesignForTestPanel.defaultProps = {
  selected: false,
};

DesignForTestPanel.tabsRole = "TabPanel";

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

const PanelContent = () => (
  <KnobTabPanelContent>
    <TabSection>
      <Checklist>
        <RenderKnob internalName="has_sram_extraction" />
        <RenderKnob internalName="has_clock_gate_extraction" />
        <RenderKnob internalName="has_group_and_wrap" />
        <RenderKnob internalName="sram_user_defined_inputs" />
        <RenderKnob internalName="sram_user_defined_outputs" />
      </Checklist>
    </TabSection>
  </KnobTabPanelContent>
);

export default DesignForTestPanel;
