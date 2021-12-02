import React from "react";
import { connect } from "react-redux";

import Knob from "core-designer/knobs/Knob";
import { UnreachableCaseError } from "utils/TypeUtilities";
import { SeriesName } from "utils/Types";

import { configuratorTabs } from "../Constants";
import { KnobTabPanelContent } from "../ConfiguratorStyles";
import RenderKnob from "./Shared/RenderKnob";
import { TabPanelWrapper } from "./TabPanelWrapper";
import { TabSection, PanelRestrictionMessage } from "./Shared/Components";

// ========================================================================== //
//                                                                            //
//                          Constants and Helpers                             //
//                                                                            //
// ========================================================================== //

type KnobMap = Map<string, Knob>;

const TAB_NAME = configuratorTabs.ports;

const hasRestrictedKnob = (knobMap: KnobMap) => {
  const peripheralPort = knobMap.get("peripheral_port_size");
  const peripheralPortRestricted =
    peripheralPort && peripheralPort.isRestricted();
  return peripheralPortRestricted || false;
};

const getPanelPropsForIPSeries = (
  ipSeries: SeriesName
): {
  showCoreLocalPort: boolean;
  showMultipleSystemPorts: boolean;
  showMemoryPort: boolean;
} => {
  switch (ipSeries) {
    case "E2":
    case "S2":
      return {
        showCoreLocalPort: false,
        showMultipleSystemPorts: true,
        showMemoryPort: false,
      };
    case "E3":
    case "S5":
    case "U5":
      return {
        showCoreLocalPort: false,
        showMultipleSystemPorts: false,
        showMemoryPort: true,
      };
    case "E6":
    case "E7":
    case "S7":
    case "U7":
      return {
        showCoreLocalPort: true,
        showMultipleSystemPorts: false,
        showMemoryPort: true,
      };
    default:
      throw new UnreachableCaseError(ipSeries);
  }
};

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

type PortsTabPanelProps = {
  knobMap: KnobMap;
  selected?: boolean;
  ipSeries: SeriesName;
};
type PortsTabPanelState = {
  activeTabKnob: string;
  activeTabSubsection: string;
};
class PortsTabPanel extends React.Component<
  PortsTabPanelProps,
  PortsTabPanelState
> {
  static tabsRole = "TabPanel";

  constructor(props: PortsTabPanelProps) {
    super(props);

    this.state = {
      activeTabKnob: "",
      activeTabSubsection: "",
    };
  }

  handlePortSubsectionClick = (
    internalName: string,
    subsectionName: string
  ) => {
    this.setState({
      activeTabKnob: internalName,
      activeTabSubsection: subsectionName,
    });
  };

  render() {
    const { selected = false, ipSeries, knobMap } = this.props;
    const {
      showCoreLocalPort,
      showMultipleSystemPorts,
      showMemoryPort,
    } = getPanelPropsForIPSeries(ipSeries);
    return (
      <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
        <PanelContent
          showRestriction={hasRestrictedKnob(knobMap)}
          showCoreLocalPort={showCoreLocalPort}
          showMultipleSystemPorts={showMultipleSystemPorts}
          showMemoryPort={showMemoryPort}
          activeTabKnob={this.state.activeTabKnob}
          activeTabSubsection={this.state.activeTabSubsection}
          onTabSubsectionClick={this.handlePortSubsectionClick}
        />
      </TabPanelWrapper>
    );
  }
}

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

type PanelContentProps = {
  showRestriction: boolean;
  showCoreLocalPort: boolean;
  showMultipleSystemPorts: boolean;
  showMemoryPort: boolean;
  activeTabKnob: string;
  activeTabSubsection: string;
  onTabSubsectionClick: (internalName: string, subsectionName: string) => void;
};

const PanelContent = ({
  showRestriction,
  showCoreLocalPort,
  showMultipleSystemPorts,
  showMemoryPort,
  activeTabKnob,
  activeTabSubsection,
  onTabSubsectionClick,
}: PanelContentProps) => (
  <KnobTabPanelContent>
    {showRestriction && (
      <TabSection isNotification>
        <PanelRestrictionMessage />
      </TabSection>
    )}
    <TabSection>
      <RenderKnob
        internalName="has_front_port"
        activeTabKnob={activeTabKnob}
        activeTabSubsection={activeTabSubsection}
        onTabSubsectionClick={onTabSubsectionClick}
      />
      <RenderKnob
        internalName="enable_front_port_pass_through"
        activeTabKnob={activeTabKnob}
        activeTabSubsection={activeTabSubsection}
        onTabSubsectionClick={onTabSubsectionClick}
      />
      {showCoreLocalPort && (
        <RenderKnob
          internalName="has_core_local_port"
          activeTabKnob={activeTabKnob}
          activeTabSubsection={activeTabSubsection}
          onTabSubsectionClick={onTabSubsectionClick}
        />
      )}
      {showMultipleSystemPorts ? (
        <>
          <RenderKnob
            internalName="has_system_port_0"
            activeTabKnob={activeTabKnob}
            activeTabSubsection={activeTabSubsection}
            onTabSubsectionClick={onTabSubsectionClick}
          />
          <RenderKnob
            internalName="has_system_port_1"
            activeTabKnob={activeTabKnob}
            activeTabSubsection={activeTabSubsection}
            onTabSubsectionClick={onTabSubsectionClick}
          />
        </>
      ) : (
        <RenderKnob
          internalName="has_system_port"
          activeTabKnob={activeTabKnob}
          activeTabSubsection={activeTabSubsection}
          onTabSubsectionClick={onTabSubsectionClick}
        />
      )}
      <RenderKnob
        internalName="has_peripheral_port"
        activeTabKnob={activeTabKnob}
        activeTabSubsection={activeTabSubsection}
        onTabSubsectionClick={onTabSubsectionClick}
      />
      {showMemoryPort && (
        <RenderKnob
          internalName="has_memory_port"
          activeTabKnob={activeTabKnob}
          activeTabSubsection={activeTabSubsection}
          onTabSubsectionClick={onTabSubsectionClick}
        />
      )}
    </TabSection>
  </KnobTabPanelContent>
);

type ReduxState = { coreDesigner: { knobMap: KnobMap } };
const mapStateToProps = (state: ReduxState) => ({
  knobMap: state.coreDesigner.knobMap,
});

export default connect(mapStateToProps)(PortsTabPanel);
