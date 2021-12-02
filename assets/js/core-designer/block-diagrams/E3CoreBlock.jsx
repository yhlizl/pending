import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";

import Knob from "core-designer/knobs/Knob";
import WebConfigPropType from "core-designer/WebConfigPropType";
import pluralized from "utils/pluralized";
import CoreBlock from "./CoreBlock";
import {
  CoreContainer,
  HalfContainedCoreBlock,
  CoreContent,
  Bold,
  CoreHR,
} from "./BlockStyles";
import { DotSeparatedRow, InternalBlock, ValueText } from "./Shared";

// ========================================================================== //
//                                                                            //
//                             Styled Components                              //
//                                                                            //
// ========================================================================== //

const E3CoreContainer = styled(CoreContainer)`
  width: 28rem;
  min-height: 33rem;
`;

const E3PMPBlock = styled(HalfContainedCoreBlock)`
  position: absolute;
  top: 15.5rem;
  right: 1.5rem;
  height: 2.9rem;
  padding: 0.5rem 0.8rem;
  width: 12rem;
`;

// ========================================================================== //
//                                                                            //
//                           Main Class Component                             //
//                                                                            //
// ========================================================================== //

class E3CoreBlock extends CoreBlock {
  render() {
    const hasPmp = this.getInternalValue("has_pmp");
    const pmpCount = this.getInternalValue("pmp_count");
    const BTB = `${this.getDisplayValue("btb_entries")} BTB Entries`;
    const BHT = `${this.getDisplayValue("bht_entries")} BHT Entries`;
    const retAddrStack = `${this.getDisplayValue(
      "ras_entries"
    )} Return Addr Stack`;
    const clockGating = this.getDisplayValue("clock_gating");
    const icacheSize = `${this.getDisplayValue("icache_size")} KiB`;
    const icacheAssoc = this.getDisplayValue("icache_assoc");
    const hasDtim = this.getInternalValue("has_dtim");
    const dtim = this.getDisplayValue("has_dtim");
    const dtimSize = `${this.getDisplayValue("dtim_size")} KiB`;
    const dcacheAssoc = hasDtim ? "" : this.getDisplayValue("dcache_assoc");
    const instrucTrace = this.getDisplayValue("instruction_trace");
    const perfCounters = this.getDisplayValue("performance_counters");
    const pluralPerfCounters = pluralized(
      perfCounters,
      "Perf Counter",
      "Perf Counters"
    );

    const has_adr_remapr = this.getInternalValue("has_adr_remapr");
    const adr_remapr_entries = this.getDisplayValue("adr_remapr_entries");

    return (
      <E3CoreContainer>
        {this.getCoreHeader()}
        <CoreContent>
          {this.getModesAndISA()}
          <CoreHR />
          <DotSeparatedRow entries={[BTB, BHT]} />
          <DotSeparatedRow entries={[retAddrStack]} />
          <CoreHR />
          <DotSeparatedRow entries={[clockGating]} />
          <DotSeparatedRow entries={[" "]} />
          <PMPBlock hasPmp={hasPmp} pmpCount={pmpCount} />
          <InternalBlock
            label="Instruc. Cache"
            enabled
            entries={[icacheSize, icacheAssoc]}
          />
          <InternalBlock
            label={dtim}
            enabled={dtim}
            entries={[dtimSize, dcacheAssoc]}
            rightAlign
          />
          <InternalBlock
            label="Adr. Remappers"
            enabled={has_adr_remapr}
            entries={[adr_remapr_entries]}
          />
          <DotSeparatedRow entries={[instrucTrace, pluralPerfCounters]} />
        </CoreContent>
      </E3CoreContainer>
    );
  }
}

E3CoreBlock.propTypes = {
  ipSeries: PropTypes.string.isRequired,
  knobs: PropTypes.arrayOf(PropTypes.instanceOf(Knob)).isRequired,
  webConfig: WebConfigPropType.isRequired,
};

// ========================================================================== //
//                                                                            //
//                                Sub-components                              //
//                                                                            //
// ========================================================================== //

const PMPBlock = ({ hasPmp, pmpCount }) => (
  <E3PMPBlock disabled={!hasPmp}>
    <Bold>PMP&nbsp;</Bold>
    <ValueText>
      {hasPmp ? pluralized(pmpCount, "Region", "Regions") : "None"}
    </ValueText>
  </E3PMPBlock>
);

PMPBlock.propTypes = {
  hasPmp: PropTypes.bool.isRequired,
  pmpCount: PropTypes.number.isRequired,
};

export default E3CoreBlock;
