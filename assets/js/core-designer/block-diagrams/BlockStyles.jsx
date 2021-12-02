import React from "react";
import styled from "styled-components";
import { transparentize } from "polished";

import {
  OLD_COLOR,
  RightColContainer,
  FONT_SIZE,
  LINE_HEIGHT,
} from "components/StyledComponents";

import { COLOR, PALETTE } from "utils/StyleConstants";

const LOCAL_COLOR = {
  EnabledPort: COLOR.GrayF0,
  DisabledPort: OLD_COLOR.GrayAA,

  EnabledBlock: PALETTE.GrayF0,
  DisabledBlock: OLD_COLOR.GrayE2,

  EnabledOffCoreBlock: PALETTE.GrayF0,
  DisabledOffCoreBlock: PALETTE.GrayE2,

  EnabledDarkOffCoreBlock: "#555",
  DisabledDarkOffCoreBlock: "#b4b4b4",

  EnabledOffCoreText: OLD_COLOR.Gray33,
  DisabledOffCoreText: OLD_COLOR.GrayAA,

  PortArrowColor: OLD_COLOR.Gray77,

  EnabledOffCoreTitle: COLOR.TextDark,
  DisabledOffCoreTitle: OLD_COLOR.GrayAA,

  EnabledOffCoreHeaderColor: PALETTE.Gray49,
  DisabledOffCoreHeaderColor: PALETTE.GrayF0,

  DiagramBackground: PALETTE.GrayD4,

  OffCoreTitle: PALETTE.Dark,
  OffCoreTitleText: PALETTE.Dark,

  TextInnerDisabled: OLD_COLOR.GrayAA,

  EnabledContainedBlockText: transparentize(0.2, PALETTE.White),
  DisabledContainedBlockText: transparentize(0.7, PALETTE.Black),
};

const GenericContainer = styled.div`
  transition: background-color 0.3s, color 0.3s;
  position: absolute;
  font-size: ${FONT_SIZE.Small};
  line-height: ${LINE_HEIGHT.Large};
  box-shadow: -2px 2px 2px 0 rgba(170, 170, 170, 0.19);
  padding: 0.5rem 0.75rem;
  background-color: ${(props) =>
    props.enabled ? LOCAL_COLOR.EnabledBlock : LOCAL_COLOR.DisabledBlock};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  @media print {
    background-color: #fff !important;
    border: solid 1px #333;
    border: ${(props) =>
      !props.enabled ? "dotted 1px #555" : "solid 1px #333"};
  }
`;

const PortContainer = styled(GenericContainer)`
  width: 11rem;
  height: 4.2rem;
  overflow-x: visible;
  color: ${(props) =>
    props.enabled ? LOCAL_COLOR.EnabledPort : LOCAL_COLOR.DisabledPort};
  background-color: ${(props) =>
    props.enabled ? LOCAL_COLOR.EnabledBlock : LOCAL_COLOR.DisabledBlock};
  ${(props) => props.enabled || "box-shadow: none;"}
`;

const PortTitle = styled.div`
  font-weight: 500;
`;

const PortContent = styled.div``;

// Arrows: https://stackoverflow.com/a/14480562
const Arrow = styled.div`
  position: relative;
  width: 4.4rem;
  bottom: 2.3rem;
  left: 9.6rem;
`;

const Triangle = styled.div`
  border-style: solid;
  border-width: 0.8rem;
  width: 0;
  height: 0;
`;

const TriangleRight = styled(Triangle)`
  border-color: transparent transparent transparent
    ${LOCAL_COLOR.PortArrowColor};
  float: right;
`;

const TriangleLeft = styled(Triangle)`
  border-color: transparent ${LOCAL_COLOR.PortArrowColor} transparent
    transparent;
  float: left;
`;

const Tail = styled.div`
  width: 2.2rem;
  height: 0.4rem;
  position: absolute;
  background-color: ${LOCAL_COLOR.PortArrowColor};
  @media print {
    background-color: ${LOCAL_COLOR.PortArrowColor} !important;
  }
`;

const TailRight = styled(Tail)`
  right: 1.5rem;
  top: 0.6rem;
`;

const TailLeft = styled(Tail)`
  left: 1.5rem;
  top: 0.6rem;
`;

const RightArrow = () => (
  <Arrow>
    <TriangleRight />
    <TailRight />
  </Arrow>
);

const LeftArrow = () => (
  <Arrow>
    <TriangleLeft />
    <TailLeft />
  </Arrow>
);

const OffCoreContainer = styled(GenericContainer)`
  padding: 0;
  width: ${(props) => (props.width ? props.width : "15rem")};
  height: ${(props) => (props.height ? props.height : "8.8rem")};
  background-color: ${(props) =>
    props.enabled
      ? LOCAL_COLOR.EnabledOffCoreBlock
      : LOCAL_COLOR.DisabledOffCoreBlock};
  color: ${(props) =>
    props.enabled
      ? LOCAL_COLOR.EnabledOffCoreText
      : LOCAL_COLOR.DisabledOffCoreText};
  ${(props) => props.enabled || "box-shadow: none;"}
`;

const OffCoreTitle = styled.div`
  padding: 0.5rem 1rem;
  color: ${(props) =>
    props.enabled
      ? LOCAL_COLOR.EnabledOffCoreTitle
      : LOCAL_COLOR.DisabledOffCoreTitle};
  background-color: ${(props) =>
    props.enabled
      ? LOCAL_COLOR.EnabledOffCoreHeader
      : LOCAL_COLOR.DisabledOffCoreHeader};
  border-bottom: solid 1px rgba(0, 0, 0, 0.06);
  font-weight: 500;
  @media print {
    ${(props) =>
      !props.enabled ||
      `background-color: ${LOCAL_COLOR.OffCoreTitle} !important`};
    color: ${(props) =>
      props.enabled ? `${LOCAL_COLOR.OffCoreTitleText} !important` : ""};
  }
`;

const OffCoreContent = styled.div`
  padding: 0.5rem 1rem;
`;

const L2Container = styled(GenericContainer)`
  padding: 0;
  width: ${(props) => (props.width ? props.width : "15rem")};
  height: ${(props) => (props.height ? props.height : "8.8rem")};
  background-color: ${(props) =>
    props.enabled
      ? LOCAL_COLOR.EnabledDarkOffCoreBlock
      : LOCAL_COLOR.DisabledDarkOffCoreBlock};
  color: ${(props) => (props.enabled ? "white" : "rgba(255,255,255,0.7)")};
  ${(props) => props.enabled || "box-shadow: none;"};
`;

const L2Title = styled.div`
  color: ${(props) => (props.enabled ? "white" : "rgba(255,255,255,0.7)")};
  font-weight: 500;
  padding: 0.5rem 0;
`;

const BlockDiagramContainer = styled(RightColContainer)`
  position: relative;
  position: sticky;
  top: 2rem;
  background-color: ${LOCAL_COLOR.DiagramBackground};
  margin-top: 3rem;
  margin-bottom: 3rem;
  @media print {
    background-color: #ddd !important;
    border: solid 1px #ddd !important;
  }
`;

const CoreContainer = styled.div`
  position: absolute;
  color: ${(props) => props.theme.accentForegroundColor};
  background-color: ${(props) => props.theme.accentColor};
  box-shadow: -2px 2px 2px 0 rgba(170, 170, 170, 0.19);
  top: 3rem;
  left: 1.5rem;
  font-size: ${FONT_SIZE.Small};
  line-height: ${LINE_HEIGHT.Giant};
  @media print {
    border: solid 1px ${(props) => props.theme.accentColorDark};
  }
`;

const CoreBlockHighlight = styled.div`
  transition: background-color 0.3s, color 0.3s;
  background-color: ${(props) => props.theme.accentColorDark};
  color: ${(props) =>
    props.disabled ? LOCAL_COLOR.TextInnerDisabled : "rgba(255,255,255,0.85)"};
  padding: 0.5rem 1.3rem;
  @media print {
    background-color: ${(props) => props.theme.accentColorDark} !important;
    color: #fff !important;
  }
`;

const TextEntry = styled.span`
  &::after {
    content: " ";
  }
`;

const TextEntrySeparated = styled(TextEntry)`
  &::after {
    content: " • ";
    margin: 0 0.1rem;
    opacity: 0.45;
  }
  &:last-child::after {
    content: "";
  }
`;

const ContainedCoreBlock = styled(CoreBlockHighlight)`
  background-color: ${(props) =>
    props.disabled
      ? props.theme.accentColorLightDisabled
      : props.theme.accentColorLight};
  color: ${(props) =>
    props.disabled
      ? LOCAL_COLOR.DisabledContainedBlockText
      : LOCAL_COLOR.EnabledContainedBlockText};
  padding: 0.5rem 0.8rem 0.6rem;
  margin: 0.5rem 0;
  @media print {
    background-color: #fff !important;
    border: ${(props) =>
      props.disabled
        ? "dotted 1px #999"
        : `solid 1px ${props.theme.accentColorDark};`};
  }
`;

const HalfContainedCoreBlock = styled(ContainedCoreBlock)`
  width: 12rem;
  display: inline-block;
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  @media print {
    width: 11.3rem;
    border: ${(props) =>
      props.disabled
        ? "dotted 1px #999"
        : `solid 1px ${props.theme.accentColorDark};`};
  }
`;

const CoreContent = styled.div`
  padding: 0.6rem 1.5rem 0.5rem;
  @media print {
    background-color: #fff !important;
  }
`;

const Bold = styled.span`
  font-weight: 500;
`;

const CoreHR = styled.hr`
  margin: 0.7rem 0rem;
  border-color: rgba(0, 0, 0, 0.15);
`;

export {
  PortContainer,
  PortTitle,
  PortContent,
  RightArrow,
  LeftArrow,
  OffCoreContainer,
  OffCoreTitle,
  OffCoreContent,
  L2Container,
  L2Title,
  BlockDiagramContainer,
  CoreContainer,
  CoreBlockHighlight,
  HalfContainedCoreBlock,
  CoreContent,
  Bold,
  CoreHR,
  TextEntrySeparated,
  TextEntry,
};
