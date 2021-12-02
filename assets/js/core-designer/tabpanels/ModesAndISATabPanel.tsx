import React from "react";

import { UnreachableCaseError } from "utils/TypeUtilities";
import { SeriesName } from "utils/Types";

import { configuratorTabs } from "../Constants";
import { KnobTabPanelContent } from "../ConfiguratorStyles";
import { TabPanelWrapper } from "./TabPanelWrapper";
import RenderKnob from "./Shared/RenderKnob";
import { Checklist, TabSection } from "./Shared/Components";

// ========================================================================== //
//                                                                            //
//                          Constants and Helpers                             //
//                                                                            //
// ========================================================================== //

const TAB_NAME = configuratorTabs.modesAndISA;

const privilegeModesHelp = `Privilege modes are used to provide protection between different components
   of the software stack.`;

const coreInterfacesHelp = `The interface between a 2-series core and the memory subsystem can have separate
   channels for instruction and data, or they can share a single channel.`;

const isaExtensionsHelp =
  "Adds new instructions that the processor can decode and execute.";

const baseIsaHelp = `RV32E reduces the number of integer registers from 32 to 16. This option is recommended
   for area constrained designs. RV32E can not be selected if Floating Point is enabled.`;

const getPanelPropsForIPSeries = (ipSeries: SeriesName): PanelContentProps => {
  switch (ipSeries) {
    case "E2":
      return {
        showBitManipulation: true,
        showCoreInterfaces: true,
        showFloatingPointHalfPrecision: true,
        showNumberOfCores: false,
        showRV32E: true,
        showSupervisorMode: false,
      };
    case "S2":
      return {
        showBitManipulation: true,
        showCoreInterfaces: true,
        showFloatingPointHalfPrecision: true,
        showNumberOfCores: false,
        showRV32E: false,
        showSupervisorMode: false,
      };
    case "E3":
      return {
        showBitManipulation: false,
        showCoreInterfaces: false,
        showFloatingPointHalfPrecision: false,
        showNumberOfCores: true,
        showRV32E: true,
        showSupervisorMode: false,
      };
    case "S5":
      return {
        showBitManipulation: false,
        showCoreInterfaces: false,
        showFloatingPointHalfPrecision: false,
        showNumberOfCores: true,
        showRV32E: false,
        showSupervisorMode: false,
      };
    case "U5":
      return {
        showBitManipulation: false,
        showCoreInterfaces: false,
        showFloatingPointHalfPrecision: false,
        showNumberOfCores: true,
        showRV32E: false,
        showSupervisorMode: true,
      };
    case "E6":
      return {
        showBitManipulation: true,
        showCoreInterfaces: false,
        showFloatingPointHalfPrecision: true,
        showNumberOfCores: true,
        showRV32E: true,
        showSupervisorMode: false,
      };
    case "E7":
      return {
        showBitManipulation: true,
        showCoreInterfaces: false,
        showFloatingPointHalfPrecision: true,
        showNumberOfCores: true,
        showRV32E: true,
        showSupervisorMode: false,
      };
    case "S7":
      return {
        showBitManipulation: true,
        showCoreInterfaces: false,
        showFloatingPointHalfPrecision: true,
        showNumberOfCores: true,
        showRV32E: false,
        showSupervisorMode: false,
      };
    case "U7":
      return {
        showBitManipulation: true,
        showCoreInterfaces: false,
        showFloatingPointHalfPrecision: true,
        showNumberOfCores: true,
        showRV32E: false,
        showSupervisorMode: true,
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

type ModesAndISATabPanelProps = {
  ipSeries: SeriesName;
  selected?: boolean;
};

const ModesAndISATabPanel = ({
  ipSeries,
  selected = false,
}: ModesAndISATabPanelProps) => {
  const {
    showBitManipulation,
    showCoreInterfaces,
    showFloatingPointHalfPrecision,
    showNumberOfCores,
    showRV32E,
    showSupervisorMode,
  } = getPanelPropsForIPSeries(ipSeries);
  return (
    <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
      <PanelContent
        showBitManipulation={showBitManipulation}
        showCoreInterfaces={showCoreInterfaces}
        showFloatingPointHalfPrecision={showFloatingPointHalfPrecision}
        showNumberOfCores={showNumberOfCores}
        showRV32E={showRV32E}
        showSupervisorMode={showSupervisorMode}
      />
    </TabPanelWrapper>
  );
};

ModesAndISATabPanel.tabsRole = "TabPanel";

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

type PanelContentProps = {
  showBitManipulation: boolean;
  showCoreInterfaces: boolean;
  showFloatingPointHalfPrecision: boolean;
  showNumberOfCores: boolean;
  showRV32E: boolean;
  showSupervisorMode: boolean;
};
const PanelContent = ({
  showBitManipulation,
  showCoreInterfaces,
  showFloatingPointHalfPrecision,
  showNumberOfCores,
  showRV32E,
  showSupervisorMode,
}: PanelContentProps) => {
  return (
    <KnobTabPanelContent>
      {showNumberOfCores && (
        <TabSection>
          <RenderKnob internalName="number_of_cores" />
        </TabSection>
      )}
      <TabSection title="Privilege Modes" tooltip={privilegeModesHelp}>
        <Checklist>
          <RenderKnob internalName="has_machine_mode" />
          <RenderKnob internalName="has_user_mode" />
          {showSupervisorMode && (
            <RenderKnob internalName="has_supervisor_mode" />
          )}
        </Checklist>
        {showSupervisorMode && (
          <RenderKnob internalName="virtual_addressing_modes" />
        )}
      </TabSection>
      {showCoreInterfaces && (
        <TabSection title="Core Interfaces" tooltip={coreInterfacesHelp}>
          <RenderKnob internalName="core_interfaces" />
        </TabSection>
      )}
      {showRV32E && (
        <TabSection title="Base ISA" tooltip={baseIsaHelp}>
          <RenderKnob internalName="has_rv32e" />
        </TabSection>
      )}
      <TabSection title="ISA Extensions" tooltip={isaExtensionsHelp}>
        <RenderKnob internalName="multiplication_extension" />
        <RenderKnob internalName="floating_point" />
        {showFloatingPointHalfPrecision && (
          <RenderKnob internalName="floating_point_half_precision_present" />
        )}
        <RenderKnob internalName="atomics_extension" />
        {showBitManipulation && (
          <RenderKnob internalName="bit_manipulation_extension" />
        )}
      </TabSection>
      <TabSection title="Extensions">
        <RenderKnob internalName="has_scie" />
      </TabSection>
    </KnobTabPanelContent>
  );
};

export default ModesAndISATabPanel;
