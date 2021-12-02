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

const E7CoreContainer = styled(CoreContainer)`
  width: 28rem;
  height: 38rem;
`;

const E7PMPBlock = styled(HalfContainedCoreBlock)`
  position: absolute;
  top: 13.8rem;
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

class E7CoreBlock extends CoreBlock {
  render() {
    const hasPmp = this.getInternalValue("has_pmp");
    const pmpCount = this.getInternalValue("pmp_count");
    const clockGating = this.getDisplayValue("clock_gating");
    const icacheMinimal = this.getInternalValue("icache_minimal_mode");
    const icacheSize = icacheMinimal
      ? "256 B"
      : `${this.getDisplayValue("icache_size")} KiB`;
    const icacheAssoc = icacheMinimal
      ? "2-way"
      : this.getDisplayValue("icache_assoc");
    const enableInstructionCacheBox = !icacheMinimal;
    const hasDtim = this.getInternalValue("has_dtim");
    // E76 and E76-MC both share Address Remapper defined in e7.json
    const has_adr_remapr = this.getInternalValue("has_adr_remapr");
    const adr_remapr_entries = this.getDisplayValue("adr_remapr_entries");
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
    const hasITim = this.getInternalValue("has_itim");
    const iTimSize = `${this.getDisplayValue("itim_size")} KiB`;
    const hasDls = this.getInternalValue("has_dls");
    const dlsSize = this.getDisplayValue("dls_size");
    const bpOptimType =
      this.getDisplayValue("bp_optim") === "Performance" ? "Perf." : "Area";
    const bpOptim = `${bpOptimType} Optimized Branch Prediction`;

    return (
      <E7CoreContainer>
        {this.getCoreHeader()}
        <CoreContent>
          {this.getModesAndISA()}
          <CoreHR />
          <DotSeparatedRow entries={[bpOptim]} />
          <CoreHR />
          <DotSeparatedRow entries={[clockGating]} />
          <DotSeparatedRow entries={[" "]} />
          <PMPBlock hasPmp={hasPmp} pmpCount={pmpCount} />

          <InternalBlock
            label="Instruc. Cache"
            enabled={enableInstructionCacheBox}
            entries={[icacheSize, icacheAssoc]}
          />
          <InternalBlock
            label={dtim}
            enabled={dtim}
            entries={[dtimSize, dcacheAssoc]}
            rightAlign
          />
          <InternalBlock
            label="Instruc. TIM"
            enabled={hasITim}
            entries={[iTimSize]}
          />
          <InternalBlock
            label="Data Loc. Store"
            enabled={hasDls}
            entries={[dlsSize]}
            rightAlign
          />
          <InternalBlock
            label="Adr. Remappers"
            enabled={has_adr_remapr}
            entries={[adr_remapr_entries]}
          />
          <DotSeparatedRow entries={[instrucTrace, pluralPerfCounters]} />
        </CoreContent>
      </E7CoreContainer>
    );
  }
}

E7CoreBlock.propTypes = {
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
  <E7PMPBlock disabled={!hasPmp}>
    <Bold>PMP&nbsp;</Bold>
    <ValueText>
      {hasPmp ? pluralized(pmpCount, "Region", "Regions") : "None"}
    </ValueText>
  </E7PMPBlock>
);

PMPBlock.propTypes = {
  hasPmp: PropTypes.bool.isRequired,
  pmpCount: PropTypes.number.isRequired,
};

export default E7CoreBlock;
