/* eslint-disable react/no-array-index-key */
/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FONT_FAMILY } from "components/StyledComponents";
import { InfoMessage } from "components/MessageComponents";
import { PALETTE } from "utils/StyleConstants";
import Knob from "./Knob";

const MemoryMapListHeading = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  line-height: 1.4;
`;

const MemoryMapList = styled.ul`
  font-family: ${FONT_FAMILY.Mono};
  font-size: 1.3rem;
  list-style: none;
  padding-left: 1rem;
`;

export const PerCoreMemoryMessage = ({ internalName, webConfig, sizeKnob }) => {
  const displayName = {
    dtim_base_addr: "Data TIM",
    itim_base_addr: "ITIM",
    dls_base_addr: "Data Local Store",
  }[internalName];
  const isMinimalICache = webConfig.icache_minimal_mode;
  const sizeKnobName = sizeKnob
    ? sizeKnob.internalName
    : internalName.replace("_base_addr", "_size");
  const memorySize = webConfig[sizeKnobName] * 1024;
  const perCoreSizeInBytes = isMinimalICache ? 256 : memorySize;
  const baseAddr = webConfig[internalName];
  return (
    <div>
      <InfoMessage backgroundColor={PALETTE.White}>
        For multicore designs, each core’s {displayName} has a unique address
        range. The address ranges are contiguous.
      </InfoMessage>
      <MemoryMapListHeading>{displayName} Address Ranges</MemoryMapListHeading>
      <MemoryMapList>
        {[...Array(webConfig.number_of_cores)].map((e, i) => (
          <li key={`core-map-${displayName}-${i}`}>
            Core {i}:&nbsp; 0x{(perCoreSizeInBytes * i + baseAddr).toString(16)}
            &nbsp;- 0x
            {(perCoreSizeInBytes * (i + 1) - 1 + baseAddr).toString(16)}
          </li>
        ))}
      </MemoryMapList>
    </div>
  );
};

PerCoreMemoryMessage.propTypes = {
  internalName: PropTypes.string.isRequired,
  webConfig: PropTypes.any.isRequired,
  sizeKnob: PropTypes.instanceOf(Knob),
};

PerCoreMemoryMessage.defaultProps = {
  sizeKnob: null,
};
