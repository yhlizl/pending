import React from "react";
import PropTypes from "prop-types";

import { getWebConfig } from "redux/store";
import { ErrorMessage } from "components/MessageComponents";
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

const TAB_NAME = configuratorTabs.interrupts;
const localInterruptorHelp =
  "Adds core-local interrupts that are wired directly into the core.";

const showInterruptscWarning = () => {
  const webConfig = getWebConfig();
  const { ip_series, has_beu, clic_interrupt_count, has_clic } = webConfig;
  if (ip_series === "E2" || ip_series === "S2") {
    if (has_clic && has_beu && clic_interrupt_count > 111) {
      return true;
    }
  }
  return false;
};

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const InterruptsTabPanel = ({ selected, ipSeries }) => (
  <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
    <PanelContent ipSeries={ipSeries} />
  </TabPanelWrapper>
);

InterruptsTabPanel.propTypes = {
  selected: PropTypes.bool,
  ipSeries: PropTypes.string.isRequired,
};

InterruptsTabPanel.defaultProps = {
  selected: false,
};

InterruptsTabPanel.tabsRole = "TabPanel";

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
    <TabSection title="Local Interrupts">
      {showInterruptscWarning() && <InterruptsChangeWarning />}
      <RenderKnob internalName="has_clic" />
      <RenderKnob internalName="has_clint" />
    </TabSection>
  </KnobTabPanelContent>
);

const RocketBulletPanelContent = () => (
  <KnobTabPanelContent>
    <TabSection>
      <RenderKnob internalName="has_plic" />
    </TabSection>
    <TabSection
      title="Core-Local Interruptor (CLINT)"
      tooltip={localInterruptorHelp}
    >
      <RenderKnob internalName="local_interrupt_count" />
    </TabSection>
  </KnobTabPanelContent>
);

const InterruptsChangeWarning = () => (
  <ErrorMessage>
    Bus Error Unit+CLIC:This configuration has a limitation of 111 interrupts or
    less due to the BEU occupying the mcause=128 interrupt slot.
  </ErrorMessage>
);

export default InterruptsTabPanel;
