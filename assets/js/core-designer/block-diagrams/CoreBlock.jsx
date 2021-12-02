import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import pluralized from "utils/pluralized";
import WebConfigPropType from "core-designer/WebConfigPropType";
import Knob from "core-designer/knobs/Knob";
import DiagramBlock from "./DiagramBlock";
import { CoreBlockHighlight } from "./BlockStyles";
import coreAndSeriesData from "../../../json/metadata/core_and_series_data.json";
import { DotSeparatedRow, ValueText } from "./Shared";

const CoreHeader = styled(CoreBlockHighlight)`
  align-items: center;
  display: flex;
  flex-direction: row;
  font-weight: 500;
`;

const CoreHeaderItem = styled.div`
  flex: 1 0 auto;
`;

const CoreTitle = styled(CoreHeaderItem)`
  text-transform: uppercase;
`;

const CoreHeaderNumOfCores = styled.div`
  background-color: rgba(0, 0, 0, 0.17);
  border-radius: 3px;
  color: #fff;
  font-weight: normal;
  margin: 0px;
  padding: 2px 4px;
`;

const CoreISAString = styled(CoreHeaderItem)`
  font-weight: 400;
  text-align: right;
  text-transform: uppercase;
`;

class CoreBlock extends DiagramBlock {
  getModesAndISA() {
    const hasMachineMode = this.getDisplayValue("has_machine_mode");
    const hasUserMode = this.getDisplayValue("has_user_mode");

    const hasMulExt = this.getInternalValue("multiplication_extension");
    const mulDisplay = this.getDisplayValue("multiplication_extension");
    const mulPerf = this.getDisplayValue("multiplication_performance");
    const mulPerfDisplay = mulPerf ? `(${mulPerf})` : "";
    const multiply = hasMulExt ? `${mulDisplay} ${mulPerfDisplay}` : mulDisplay;

    const hasAtomics = this.getInternalValue("atomics_extension");
    const atomics = hasAtomics ? this.getDisplayValue("atomics_extension") : "";
    const floatingPoint = this.getReviewValue("floating_point");

    const hasScie = this.getDisplayValue("has_scie");

    const hasClic = this.getInternalValue("has_clic");
    const localInterruptCount = this.getDisplayValue("local_interrupt_count");
    const localInterrupts = localInterruptCount
      ? pluralized(localInterruptCount, "Local Interrupt", "Local Interrupts")
      : "";
    const displayLocalIntrpt = hasClic ? "" : localInterrupts;

    return (
      <div>
        <DotSeparatedRow entries={[hasMachineMode, hasUserMode]} />
        <DotSeparatedRow entries={[multiply, atomics, floatingPoint]} />
        <DotSeparatedRow entries={[hasScie, displayLocalIntrpt]} />
      </div>
    );
  }

  getISAString() {
    /*
    ISA String Guide (order must be enforced)
      I: Integer
      M: Integer Multiplication and Division
      A: Atomics
      F: Single-Precision Floating-Point
      D: Double-Precision Floating-Point
      G = IMAFD: General

      Q: Quad-Precision Floating-Point
      L: Decimal Floating-Point
      C: 16-bit Compressed Instructions
      B: Bit Manipulation
      J: Dynamic Languages
      T: Transactional Memory
      P: Packed-SIMD Extensions
      V: Vector Extensions
      N: User-Level Interrupts
      Xabc: Non-standard extension “abc”
      Sdef: Supervisor extension “def”
      SXghi: Supervisor extension “ghi”
      */

    // Make a map of core series to bits
    const seriesAddressMap = coreAndSeriesData.reduce((map, obj) => {
      map[obj.seriesName] = obj.bits;
      return map;
    }, {});
    // start constructing ISA string
    let isaString = "RV";

    // Address space size
    isaString += seriesAddressMap[this.props.ipSeries];

    const integer = this.props.webConfig.has_rv32e ? "E" : "I";
    isaString += integer;

    // "Multiplication and Division"
    if (this.props.webConfig.multiplication_extension) {
      isaString += "M";
    }

    // TODO: fill in logic for the rest
    if (this.props.webConfig.atomics_extension) {
      isaString += "A";
    }

    const { floating_point } = this.props.webConfig;
    if (floating_point && floating_point !== "No FP") {
      isaString += "F";
      if (floating_point === "FP (F & D)") {
        isaString += "D";
      }
    }

    // Compressed instructions always on
    isaString += "C";

    if (this.props.webConfig.bit_manipulation_extension) {
      isaString += "B";
    }

    return isaString;
  }

  getCoreHeader() {
    const numOfCores = this.props.webConfig.number_of_cores;
    return (
      <CoreHeader>
        <CoreTitle>{this.props.ipSeries} Series Core</CoreTitle>
        {numOfCores && (
          <CoreHeaderNumOfCores>
            <ValueText>{pluralized(numOfCores, "Core", "Cores")}</ValueText>
          </CoreHeaderNumOfCores>
        )}

        <CoreISAString>
          <ValueText>{this.getISAString()}</ValueText>
        </CoreISAString>
      </CoreHeader>
    );
  }
}

CoreBlock.propTypes = {
  ipSeries: PropTypes.string.isRequired,
  knobs: PropTypes.arrayOf(PropTypes.instanceOf(Knob)).isRequired,
  webConfig: WebConfigPropType.isRequired,
};

export default CoreBlock;
