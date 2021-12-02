import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components";

import {
  FONT_SIZE,
  LINE_HEIGHT,
  FONT_FAMILY,
} from "components/StyledComponents";

import { COLOR, PALETTE, FONT_WEIGHTS } from "utils/StyleConstants";
import { getFormattedHex } from "./AddressUtils";

const LOCAL_COLOR = {
  TextBoxOutline: COLOR.PrimaryBrand,
  RangeText: PALETTE.Gray88,
};

export const KnobDisabled = styled.div`
  ${(props) =>
    props.disabled &&
    css`
      pointer-events: none;
      opacity: 0.5;
    `}
`;

export const StyledLabel = styled.label`
  font-size: ${FONT_SIZE.Medium};
  line-height: ${LINE_HEIGHT.Medium};
  ${(props) => props.disabled && `color: ${PALETTE.GrayAA};`}
  ${(props) =>
    props.isInline
      ? "display: inline-block;"
      : `
          display: grid;
          grid-row-gap: 0.4rem;
        `}
`;

export const SeparatorLabel = styled.label`
  font-size: ${FONT_SIZE.Medium};
  text-decoration: underline;
  line-height: ${LINE_HEIGHT.Medium};
  ${(props) => props.disabled && `color: ${PALETTE.GrayAA};`}
  ${(props) =>
    props.isInline
      ? "display: inline-block;"
      : `
          display: grid;
          grid-row-gap: 0.4rem;
        `}
`;

export const StyledTextBox = styled.input`
  display: inline-block;
  width: ${(props) => (props.isInline ? "4.8rem" : "25.6rem")};
  padding: 0.2rem 0.2rem 0.2rem 0.4rem;
  text-align: ${(props) => (props.rightJustified ? "right" : "left")};
  ${(props) =>
    props.isInline &&
    `
      margin-left: 1rem;
      margin-right: 1rem;
    `}
  outline: ${(props) =>
    props.valid ? "" : `${LOCAL_COLOR.TextBoxOutline} auto 5px`};
  background-color: ${(props) => (props.readOnly ? "#d3d3d3" : "")};
  border: ${(props) => (props.readOnly ? "1px solid #DFDFDF" : "")};
  color: ${(props) => (props.readOnly ? "#555" : "")};
`;

export const RangeText = styled.div`
  color: ${(props) =>
    props.disabled ? PALETTE.GrayAA : LOCAL_COLOR.RangeText};
  font-size: ${FONT_SIZE.Small};
  line-height: ${LINE_HEIGHT.Giant};
`;

export const SupplementalText = RangeText;

export const HelpIcon = styled.div`
  background-image: url(${window.staticRootPath}/fcd/images/tooltip-icon@2x.png);
  background-size: 14px 14px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
  margin-left: 8px;
  position: relative;
  top: 2px;
`;

export const Title = styled.div`
  font-size: ${FONT_SIZE.Medium};
  line-height: ${LINE_HEIGHT.Giant};
  ${(props) => props.disabled && `color: ${PALETTE.GrayAA}`}
`;

export const PortSizeLabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const BoldKnobName = styled.div`
  font-weight: ${FONT_WEIGHTS.Medium};
  font-size: 1.3rem;
  color: ${(props) => (props.disabled ? PALETTE.GrayAA : PALETTE.Gray66)};
`;

/* Address Styles */

export const MonospaceTextSpan = styled.span`
  font-family: ${FONT_FAMILY.Mono};
  ${(props) => props.disabled && `color: ${PALETTE.GrayAA};`}
`;

export const HexAddressNotes = ({ minVal, inclusiveRangeMax }) => (
  <RangeText>
    <div>Base and top address must be in range</div>
    <MonospaceTextSpan>
      {getFormattedHex(minVal)} &ndash; {getFormattedHex(inclusiveRangeMax)}
    </MonospaceTextSpan>
    .
  </RangeText>
);

HexAddressNotes.propTypes = {
  minVal: PropTypes.number.isRequired,
  inclusiveRangeMax: PropTypes.number.isRequired,
};
