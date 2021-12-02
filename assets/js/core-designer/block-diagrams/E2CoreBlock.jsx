import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { transparentize } from "polished";

import Knob from "core-designer/knobs/Knob";
import WebConfigPropType from "core-designer/WebConfigPropType";
import pluralized from "utils/pluralized";

import { OLD_COLOR } from "components/StyledComponents";
import { PALETTE } from "utils/StyleConstants";
import {
  CoreContainer,
  HalfContainedCoreBlock,
  CoreContent,
  Bold,
  CoreHR,
} from "./BlockStyles";
import CoreBlock from "./CoreBlock";
import {
  DotSeparatedRow,
  PluralizedValue,
  ValueText,
  InternalBlock,
} from "./Shared";

// ========================================================================== //
//                                                                            //
//                             Styled Components                              //
//                                                                            //
// ========================================================================== //

const containerHeight = 22;
const uiCacheTop = `${containerHeight + 0.7}rem`;
const tim0Top = `${containerHeight + 0.7}rem`;
const tim1Top = `${containerHeight + 5.2}rem`;
const tim0InterconnectTop = `${containerHeight + 2.8}rem`;
const tim1InterconnectTop = `${containerHeight + 7}rem`;
const busInterconnectHeight = `${containerHeight + 9.1}rem`;

const LOCAL_COLOR = {
  Interconnect: OLD_COLOR.GrayBD,
};

const E2CoreContainer = styled(CoreContainer)`
  width: 26.5rem;
  height: ${containerHeight}rem;
`;

const E2PMPBlock = styled(HalfContainedCoreBlock)`
  position: absolute;
  top: 18rem;
  right: 1.4rem;
  height: 3rem;
  padding: 0.5rem 0 0.5rem 0.7rem;
  width: 11rem;
`;

const E2TIMBlock = styled(E2PMPBlock)`
  box-shadow: ${(props) =>
    props.disabled ? "none" : "-2px 2px 2px 0 rgba(170,170,170,0.19)"};
  right: 0;
  top: ${(props) => (props.top ? ` ${tim0Top}` : `${tim1Top}`)};
  height: 3.4rem;
  padding: 0.7rem 0.8rem 0 1rem;
  width: 15.5rem;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.accentColorDisabled
      : props.theme.accentColorDark};
  color: ${(props) =>
    props.disabled
      ? transparentize(0.7, PALETTE.Black)
      : transparentize(0.05, PALETTE.White)};
`;

const E2TIMValues = styled.div`
  position: absolute;
  top: 0.7rem;
  right: 0.9rem;
  width: 60%;
  text-align: right;
`;

const E2uICacheBlock = styled(E2PMPBlock)`
  box-shadow: ${(props) =>
    props.disabled ? "none" : "-2px 2px 2px 0 rgba(170,170,170,0.19)"};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  top: ${uiCacheTop};
  left: 0;
  height: 7.9rem;
  padding: 0.7rem 0.3rem 0.7rem 0.9rem;
  width: 9.9rem;
  background-color: ${(props) =>
    props.disabled
      ? props.theme.accentColorDisabled
      : props.theme.accentColorDark};
  color: ${(props) =>
    props.disabled
      ? transparentize(0.7, PALETTE.Black)
      : transparentize(0.05, PALETTE.White)};
`;

const Interconnect = styled.div`
  position: absolute;
  background-color: ${LOCAL_COLOR.Interconnect};
  height: 0.3rem;
`;

const Tim0ToBusInterconnect = styled(Interconnect)`
  top: ${tim0InterconnectTop};
  right: -2rem;
  width: 2rem;
`;

const Tim1ToBusInterconnect = styled(Tim0ToBusInterconnect)`
  top: ${tim1InterconnectTop};
`;

const CoreToBusInterconnect = styled(Interconnect)`
  top: 7.5rem;
  right: -1.7rem;
  width: 1.7rem;
`;

const DoubleCoreToBusInterconnect = styled(Interconnect)`
  top: 9.5rem;
  right: -1.7rem;
  width: 1.7rem;
`;

const BusInterconnect = styled(Interconnect)`
  height: ${busInterconnectHeight};
  top: 0;
  right: -2rem;
  width: 0.8rem;
`;

const BoxHeader = styled(Bold)`
  padding-bottom: 3px;
`;

// ========================================================================== //
//                                                                            //
//                           Main Class Component                             //
//                                                                            //
// ========================================================================== //

class E2CoreBlock extends CoreBlock {
  render() {
    const hasTim0 = this.getInternalValue("has_tim_0");
    const hasTim1 = this.getInternalValue("has_tim_1");
    const tim0Display = hasTim0 ? this.getDisplayValue("tim_0_size") : "None";
    const tim1Display = hasTim1 ? this.getDisplayValue("tim_1_size") : "None";
    const tim0Amo = hasTim0 && this.getInternalValue("tim_0_amo") ? "AMO" : "";
    const tim1Amo = hasTim1 && this.getInternalValue("tim_1_amo") ? "AMO" : "";

    const hasPmp = this.getInternalValue("has_pmp");
    const pmpCount = this.getInternalValue("pmp_count");
    const perfCounters = this.getInternalValue("performance_counters");
    const coreInterfaces = this.getInternalValue("core_interfaces");
    const displayCoreInterfaces = pluralized(
      coreInterfaces,
      "Core Interface",
      "Core Interfaces"
    );
    const clockGating = this.getDisplayValue("clock_gating");
    const hasIntrucTrace = this.getInternalValue("instruction_trace");
    const intrucTrace = this.getDisplayValue("instruction_trace");

    const hasUiCache = this.getInternalValue("has_uicache");
    const uiCacheSize = this.getDisplayValue("uicache_size") || "None";
    const uiCacheLine = this.getInternalValue("uicache_line_size");

    const has_adr_remapr = this.getInternalValue("has_adr_remapr");
    const adr_remapr_entries = this.getDisplayValue("adr_remapr_entries");

    return (
      <E2CoreContainer>
        {this.getCoreHeader()}
        <CoreContent>
          {this.getModesAndISA()}
          <DotSeparatedRow entries={[displayCoreInterfaces, clockGating]} />
          <CoreHR />
          <div>{hasIntrucTrace && intrucTrace}</div>
          <PluralizedValue
            value={perfCounters}
            singular="Perf Counter"
            plural="Perf Counters"
          />
          <PMPBlock hasPmp={hasPmp} pmpCount={pmpCount} />
          <InternalBlock
            label="Adr. Remappers"
            enabled={has_adr_remapr}
            entries={[adr_remapr_entries]}
            rightAlign
          />
          <UICacheBlock
            hasUiCache={hasUiCache}
            size={uiCacheSize}
            line={uiCacheLine}
          />
          <TIMBlock timName="TIM 0" timDisplay={tim0Display} amo={tim0Amo} />
          <TIMBlock timName="TIM 1" timDisplay={tim1Display} amo={tim1Amo} />
          <Interconnections coreInterfaces={coreInterfaces} />
        </CoreContent>
      </E2CoreContainer>
    );
  }
}

E2CoreBlock.propTypes = {
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
  <E2PMPBlock disabled={!hasPmp}>
    <Bold>PMP&nbsp;</Bold>
    <ValueText>
      {hasPmp ? pluralized(pmpCount, "Region", "Regions") : "None"}
    </ValueText>
  </E2PMPBlock>
);

PMPBlock.propTypes = {
  hasPmp: PropTypes.bool.isRequired,
  pmpCount: PropTypes.number.isRequired,
};

const TIMBlock = ({ timName, timDisplay, amo }) => (
  <E2TIMBlock disabled={timDisplay === "None"} top={timName === "TIM 0"}>
    <Bold>{timName}</Bold>
    <E2TIMValues>
      <DotSeparatedRow entries={[timDisplay, amo]} />
    </E2TIMValues>
  </E2TIMBlock>
);

TIMBlock.propTypes = {
  timName: PropTypes.string.isRequired,
  timDisplay: PropTypes.string.isRequired,
  amo: PropTypes.string.isRequired,
};

const UICacheBlock = ({ hasUiCache, size, line }) => (
  <E2uICacheBlock disabled={!hasUiCache}>
    <BoxHeader>μInstr Cache</BoxHeader>
    {hasUiCache ? (
      <>
        <div>
          <ValueText>{`${size} KiB`}</ValueText>
        </div>
        <div>
          <ValueText>{`${line}-byte Line`}</ValueText>
        </div>
      </>
    ) : (
      "None"
    )}
  </E2uICacheBlock>
);

UICacheBlock.propTypes = {
  hasUiCache: PropTypes.bool.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  line: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const Interconnections = ({ coreInterfaces }) => (
  <>
    <BusInterconnect />
    <Tim0ToBusInterconnect />
    <Tim1ToBusInterconnect />
    <CoreToBusInterconnect />
    {coreInterfaces > 1 && <DoubleCoreToBusInterconnect />}
  </>
);

Interconnections.propTypes = {
  coreInterfaces: PropTypes.number.isRequired,
};

export default E2CoreBlock;
