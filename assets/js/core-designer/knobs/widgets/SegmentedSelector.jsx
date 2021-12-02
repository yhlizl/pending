import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { WarningMessage } from "components/MessageComponents";
import { FONT_SIZE } from "components/StyledComponents";
import { KnobInfoMessage } from "core-designer/tabpanels/Shared/Components";
import { PALETTE } from "utils/StyleConstants";
import { KnobTitle } from "../SharedComponents";
import { KnobDisabled } from "../KnobStyles";

// ========================================================================== //
//                                                                            //
//                                    Helpers                                 //
//                                                                            //
// ========================================================================== //

const choiceTypes = [PropTypes.string, PropTypes.number, PropTypes.bool];

// ========================================================================== //
//                                                                            //
//                             Styled Components                              //
//                                                                            //
// ========================================================================== //

const LOCAL_COLOR = {
  SegmentBackground: "none",
  SegmentBorder: PALETTE.GrayBD,
  SegmentText: "#555",
  SelectedSegmentBackground: PALETTE.GrayE5,
  SelectedSegmentBorder: PALETTE.GrayBD,
  SelectedSegmentText: PALETTE.Gray49,
  Message_Color: PALETTE.red,
};

const BORDER_RADIUS = "5px";

const SegmentContainer = styled.div`
  display: flex;
  padding-left: 1px;
`;

const Segment = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  border: 1px solid ${LOCAL_COLOR.SegmentBorder};
  background-color: ${LOCAL_COLOR.SegmentBackground};
  padding: 1.2rem 1.5rem 1.3rem;
  margin-left: -0.1rem;
  color: ${LOCAL_COLOR.SegmentText};
  font-size: ${FONT_SIZE.Small};
  font-weight: 400;
  text-align: center;
  cursor: pointer;
  user-select: none;
  &:first-child {
    border-radius: ${BORDER_RADIUS} 0 0 ${BORDER_RADIUS};
  }
  &:last-child {
    border-radius: 0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0;
  }
`;

const SelectedSegment = styled(Segment)`
  padding: 1.2rem 1.4rem 1.3rem;
  cursor: default;
  font-weight: 500;
  background: none;
  background-color: ${LOCAL_COLOR.SelectedSegmentBackground};
  border-color: ${LOCAL_COLOR.SelectedSegmentBorder};
  color: ${LOCAL_COLOR.SelectedSegmentText};
  z-index: 1;
`;

const DisabledSegment = styled(Segment)`
  cursor: auto;
  background-color: ${LOCAL_COLOR.SelectedSegmentBackground};
  border-color: ${LOCAL_COLOR.SelectedSegmentBorder};
  opacity: 0.4;
`;

const SegmentPanel = styled.div`
  display: grid;
  grid-row-gap: 0.8rem;
`;

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const SegmentedSelector = ({
  displayName,
  internalName,
  tooltip,
  selected,
  choices,
  disabledChoices,
  designHasDtim,
  disabled,
}) => (
  <SegmentPanel>
    {displayName && (
      <KnobTitle
        displayName={displayName}
        tooltip={tooltip}
        disabled={disabled}
      />
    )}
    <KnobDisabled disabled={disabled}>
      <SegmentContainer>
        <AllChoiceSegments
          selectedValue={selected}
          choices={choices}
          disabledChoices={disabledChoices}
        />
      </SegmentContainer>
    </KnobDisabled>
    <ChoiceSegmentMessage
      selectedValue={selected}
      internalName={internalName}
    />
    {internalName === "has_dtim" && (
      <MemoryPortInfoBox hasMemoryPort={!designHasDtim} />
    )}
  </SegmentPanel>
);

SegmentedSelector.defaultProps = {
  tooltip: "",
  restriction: {
    type: null,
    value: null,
    capabilities: [],
  },
};

SegmentedSelector.propTypes = {
  choices: PropTypes.instanceOf(Array).isRequired,
  restriction: PropTypes.shape({
    type: PropTypes.string,
    value: PropTypes.number,
    capabilities: PropTypes.instanceOf(Array),
  }),
  selected: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
  ]).isRequired,
  tooltip: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  designHasDtim: PropTypes.bool.isRequired,
  internalName: PropTypes.string.isRequired,
  disabledChoices: PropTypes.arrayOf(PropTypes.oneOfType(choiceTypes))
    .isRequired,
  disabled: PropTypes.bool.isRequired,
};

// ========================================================================== //
//                                                                            //
//                               Sub-Components                               //
//                                                                            //
// ========================================================================== //

// FIXME_GLOBAL - memory port controlled by dtim/dcache
const MemoryPortInfoBox = ({ hasMemoryPort }) => (
  <KnobInfoMessage
    boldMessage={`Memory port ${hasMemoryPort ? "enabled. " : "disabled. "}`}
  >
    Memory port is
    {hasMemoryPort ? " enabled " : " disabled "}
    for core designs
    {hasMemoryPort ? " with " : " without "}a data cache.
  </KnobInfoMessage>
);

MemoryPortInfoBox.propTypes = {
  hasMemoryPort: PropTypes.bool.isRequired,
};

const AllChoiceSegments = ({ selectedValue, choices, disabledChoices }) => (
  <>
    {choices.map((choice) => (
      <ChoiceSegment
        key={choice.internalValue}
        selectedValue={selectedValue}
        choice={choice}
        disabledChoices={disabledChoices}
      />
    ))}
  </>
);

AllChoiceSegments.propTypes = {
  selectedValue: PropTypes.oneOfType(choiceTypes).isRequired,
  disabledChoices: PropTypes.arrayOf(PropTypes.oneOfType(choiceTypes))
    .isRequired,
  choices: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const ChoiceSegmentMessage = ({ selectedValue, internalName }) => {
  if (selectedValue === "AXI4" && internalName === "front_port_protocol") {
    return (
      <WarningMessage>
        Note that transactions from an AXI Front Port are not able to target
        AHB/AHB_Lite Memory, System, or Peripheral Ports.
      </WarningMessage>
    );
  }
  return null;
};

ChoiceSegmentMessage.propTypes = {
  selectedValue: PropTypes.oneOfType(choiceTypes).isRequired,
  internalName: PropTypes.string.isRequired,
};

const ChoiceSegment = ({ selectedValue, choice, disabledChoices }) => {
  if (choice.internalValue === selectedValue) {
    return (
      <SelectedSegment onClick={choice.handleChange}>
        <div>{choice.displayValue}</div>
      </SelectedSegment>
    );
  }
  if (disabledChoices.includes(choice.internalValue)) {
    return <DisabledSegment>{choice.displayValue}</DisabledSegment>;
  }
  return (
    <Segment onClick={choice.handleChange}>
      <div>{choice.displayValue}</div>
    </Segment>
  );
};

ChoiceSegment.propTypes = {
  selectedValue: PropTypes.oneOfType(choiceTypes).isRequired,
  disabledChoices: PropTypes.arrayOf(PropTypes.oneOfType(choiceTypes))
    .isRequired,
  choice: PropTypes.shape({
    displayValue: PropTypes.string,
    reviewValue: PropTypes.string,
    internalValue: PropTypes.oneOfType(choiceTypes),
    handleChange: PropTypes.func,
  }).isRequired,
};

export default SegmentedSelector;
