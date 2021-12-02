import React from "react";
import { connect } from "react-redux";

import Knob from "core-designer/knobs/Knob";
import { getWebConfig } from "redux/store";
import { ErrorMessage } from "components/MessageComponents";
import { SeriesName } from "utils/Types";
import { UnreachableCaseError } from "utils/TypeUtilities";

import { configuratorTabs } from "../Constants";
import { KnobTabPanelContent } from "../ConfiguratorStyles";
import RenderKnob from "./Shared/RenderKnob";
import { TabPanelWrapper } from "./TabPanelWrapper";
import {
  Checklist,
  TabSection,
  PanelRestrictionMessage,
  KnobInfoMessage,
} from "./Shared/Components";
// ========================================================================== //
//                                                                            //
//                          Constants and Helpers                             //
//                                                                            //
// ========================================================================== //

type KnobMap = Map<string, Knob>;

const TAB_NAME = configuratorTabs.onChipMemory;

const adrRemprHelp =
  "The Address Remapper supports dynamic translation of addresses from one location to another. The address remapper can be used to support ROM patching with up to 64 entries.";

const timHelp =
  "A software-managed scratchpad memory with a single-cycle access time.";

const iCacheHelp =
  "Instruction caches store recently used instructions near the processor.";

const dCacheHelp = `The core data subsystem keeps data close to the processor.
  Tightly-Integrated Memories (TIMs) are scratchpad memories managed by
  software, whereas data caches automatically choose what data to retain.`;

const dCacheHelpUSeries = `The core data subsystem keeps data close to the processor.
  Data caches automatically choose what data to retain.`;

const hasRestrictedKnob = (knobMap: KnobMap) => {
  const icache = knobMap.get("icache_size");
  const tim0 = knobMap.get("tim_0_size");
  const icacheRestricted = icache && icache.isRestricted();
  const tim0Restricted = tim0 && tim0.isRestricted();
  return icacheRestricted || tim0Restricted || false;
};

const showDcacheAssocWarning = () => {
  const webConfig = getWebConfig();
  const { dcache_assoc, dtim_size, has_l2_cache } = webConfig;
  return !has_l2_cache && dtim_size / dcache_assoc > 4;
};

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

type OnChipMemoryTabPanelProps = {
  ipSeries: SeriesName;
  knobMap: KnobMap;
  selected?: boolean;
};
const OnChipMemoryTabPanel = ({
  ipSeries,
  knobMap,
  selected = false,
}: OnChipMemoryTabPanelProps) => (
  <TabPanelWrapper tabName={TAB_NAME} selected={selected}>
    <PanelContent
      ipSeries={ipSeries}
      showRestriction={hasRestrictedKnob(knobMap)}
    />
  </TabPanelWrapper>
);

OnChipMemoryTabPanel.tabsRole = "TabPanel";

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

type PanelContentProps = {
  ipSeries: SeriesName;
  showRestriction: boolean;
};
const PanelContent = ({ ipSeries, showRestriction }: PanelContentProps) => {
  switch (ipSeries) {
    case "E2":
    case "S2":
      return (
        <CaboosePanelContent showRestriction={showRestriction} showAdrRemapr />
      );
    case "E3":
    case "S5":
      return (
        <RocketPanelContent
          showRestriction={showRestriction}
          showDTIMOption
          showAdrRemapr
        />
      );
    case "U5":
      return (
        <RocketPanelContent
          showRestriction={showRestriction}
          showDTIMOption={false}
          showAdrRemapr={false}
        />
      );
    /* Separated E7 from S7 so that each can be tested separately for Adr.
     * Remapper */
    case "E6":
      return (
        <BulletPanelContent
          showRestriction={showRestriction}
          showICacheMinimalMode
          showDTIMOption
          showFastIO
          showAdrRemapr
        />
      );
    case "E7":
      return (
        <BulletPanelContent
          showRestriction={showRestriction}
          showICacheMinimalMode={false}
          useInstructionCacheCheckbox
          showDTIMOption
          showFastIO
          showAdrRemapr
        />
      );
    case "S7":
      return (
        <BulletPanelContent
          showRestriction={showRestriction}
          showICacheMinimalMode={false}
          useInstructionCacheCheckbox
          showDTIMOption
          showFastIO
          showAdrRemapr
        />
      );
    case "U7":
      return (
        <BulletPanelContent
          showRestriction={showRestriction}
          showICacheMinimalMode={false}
          useInstructionCacheCheckbox={false}
          showDTIMOption={false}
          showFastIO={false}
          showAdrRemapr={false}
        />
      );
    default:
      throw new UnreachableCaseError(ipSeries);
  }
};

type CaboosePanelContentProps = {
  showRestriction: boolean;
  showAdrRemapr: boolean;
};
const CaboosePanelContent = ({
  showRestriction,
  showAdrRemapr,
}: CaboosePanelContentProps) => (
  <KnobTabPanelContent>
    {showRestriction && (
      <TabSection isNotification>
        <PanelRestrictionMessage />
      </TabSection>
    )}
    <TabSection title="Tightly Integrated Memory" tooltip={timHelp}>
      <RenderKnob internalName="has_tim_0" />
      <RenderKnob internalName="has_tim_1" />
      <RenderKnob internalName="has_uicache" />
    </TabSection>
    {showAdrRemapr && (
      /* all bullet panels do not have adress remapper. Only E7 and S7 will pass
       * showAdrRemapr=true. U7 will pass showAdrRemapr=false */
      <TabSection title="Address Remapper" tooltip={adrRemprHelp}>
        <RenderKnob internalName="has_adr_remapr" />
      </TabSection>
    )}
    <TabSection title="Error Handling">
      <Checklist>
        <RenderKnob internalName="has_beu" />
        <RenderKnob internalName="has_ecc" />
      </Checklist>
    </TabSection>
  </KnobTabPanelContent>
);

type RocketPanelContentProps = {
  showRestriction: boolean;
  showDTIMOption: boolean;
  showAdrRemapr: boolean;
};
const RocketPanelContent = ({
  showRestriction,
  showDTIMOption,
  showAdrRemapr,
}: RocketPanelContentProps) => (
  <KnobTabPanelContent>
    {showRestriction && (
      <TabSection isNotification>
        <PanelRestrictionMessage />
      </TabSection>
    )}
    <TabSection title="Instruction Cache" tooltip={iCacheHelp}>
      <RenderKnob internalName="icache_size" />
      <RenderKnob internalName="icache_assoc" />
    </TabSection>
    {showDTIMOption ? (
      <TabSection title="Data Subsystem" tooltip={dCacheHelp}>
        <RenderKnob internalName="has_dtim" />
        <RenderKnob internalName="dtim_size" />
        <RenderKnob internalName="dtim_base_addr" />
        <RenderKnob internalName="dcache_assoc" />
      </TabSection>
    ) : (
      <TabSection title="Data Cache" tooltip={dCacheHelpUSeries}>
        <RenderKnob internalName="dtim_size" />
        <RenderKnob internalName="dtim_base_addr" />
        <RenderKnob internalName="dcache_assoc" />
        {showDcacheAssocWarning() && <DCacheAssocWarning />}
      </TabSection>
    )}
    <TabSection title="L2 Cache">
      <RenderKnob internalName="has_l2_cache" />
    </TabSection>
    {showAdrRemapr && (
      /* all bullet panels do not have adress remapper. Only E7 and S7 will pass
       * showAdrRemapr=true. U7 will pass showAdrRemapr=false */
      <TabSection title="Address Remapper" tooltip={adrRemprHelp}>
        <RenderKnob internalName="has_adr_remapr" />
      </TabSection>
    )}
    <TabSection title="Error Handling">
      <Checklist>
        <RenderKnob internalName="has_beu" />
        <RenderKnob internalName="has_ecc" />
      </Checklist>
    </TabSection>
  </KnobTabPanelContent>
);

type BulletPanelContentProps = {
  showRestriction: boolean;
  showICacheMinimalMode: boolean;
  useInstructionCacheCheckbox?: boolean;
  showDTIMOption: boolean;
  showFastIO: boolean;
  showAdrRemapr: boolean;
};
const BulletPanelContent = ({
  showRestriction,
  showICacheMinimalMode,
  useInstructionCacheCheckbox,
  showDTIMOption,
  showFastIO,
  showAdrRemapr,
}: BulletPanelContentProps) => (
  <KnobTabPanelContent>
    {showRestriction && (
      <TabSection isNotification>
        <PanelRestrictionMessage />
      </TabSection>
    )}
    {(() => {
      if (showICacheMinimalMode) {
        return (
          <TabSection title="Instruction Cache" tooltip={iCacheHelp}>
            <RenderKnob internalName="icache_minimal_mode" />
            <RenderKnob internalName="icache_config_mode" />
          </TabSection>
        );
      }
      if (!useInstructionCacheCheckbox) {
        return (
          <TabSection title="Instruction Cache" tooltip={iCacheHelp}>
            <RenderKnob internalName="icache_size" />
            <RenderKnob internalName="icache_assoc" />
          </TabSection>
        );
      }
      return (
        <TabSection>
          <RenderKnob internalName="icache_config_mode" />
        </TabSection>
      );
    })()}
    {showDTIMOption ? (
      <TabSection title="Data Subsystem" tooltip={dCacheHelp}>
        <RenderKnob internalName="has_dtim" />
        <RenderKnob internalName="dtim_size" />
        <RenderKnob internalName="dtim_base_addr" />
        <RenderKnob internalName="dcache_assoc" />
      </TabSection>
    ) : (
      <TabSection title="Data Cache" tooltip={dCacheHelpUSeries}>
        <RenderKnob internalName="dtim_size" />
        <RenderKnob internalName="dtim_base_addr" />
        <RenderKnob internalName="dcache_assoc" />
        {showDcacheAssocWarning() && <DCacheAssocWarning />}
      </TabSection>
    )}
    <TabSection title="Instruction TIM">
      <RenderKnob internalName="has_itim" />
    </TabSection>
    <TabSection title="Data Local Store">
      {showDTIMOption && <DLSInfo />}
      <RenderKnob internalName="has_dls" />
    </TabSection>
    <TabSection title="L2 Cache">
      <RenderKnob internalName="has_l2_cache" />
    </TabSection>
    {showFastIO && (
      <TabSection title="Fast I/O">
        <RenderKnob internalName="has_fast_io" />
      </TabSection>
    )}
    {showAdrRemapr && (
      /* all bullet panels do not have adress remapper. Only E7 and S7 will pass
       * showAdrRemapr=true. U7 will pass showAdrRemapr=false */
      <TabSection title="Address Remapper" tooltip={adrRemprHelp}>
        <RenderKnob internalName="has_adr_remapr" />
      </TabSection>
    )}
    <TabSection title="MMIO registers">
      <RenderKnob internalName="number_of_MMIO_reg" />
    </TabSection>
    <TabSection title="Error Handling">
      <Checklist>
        <RenderKnob internalName="has_beu" />
        <RenderKnob internalName="has_ecc" />
      </Checklist>
    </TabSection>
  </KnobTabPanelContent>
);

const DCacheAssocWarning = () => (
  <ErrorMessage>
    When an L2 Cache disabled, the size of the Data Cache must be less than or
    equal to 4 KiB per way. To resolve this error, please decrease the Data
    Cache size, increase the Data Cache associativity, or enable the L2 Cache.
  </ErrorMessage>
);

const DLSInfo = () => (
  <KnobInfoMessage>
    Data Local Store can only be enabled for core designs with a data cache.
  </KnobInfoMessage>
);

type ReduxState = { coreDesigner: { knobMap: KnobMap } };
const mapStateToProps = (state: ReduxState) => ({
  knobMap: state.coreDesigner.knobMap,
});

export default connect(mapStateToProps)(
  OnChipMemoryTabPanel
) as React.FunctionComponent<OnChipMemoryTabPanelProps>;
