import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import Slider from "rc-slider/lib/Slider";
import "rc-slider/assets/index.css";

import { VStack } from "components/Spacing";
import { FONT_SIZE } from "components/StyledComponents";
import { PALETTE, FONT_WEIGHTS } from "utils/StyleConstants";
import { getStaticRootPath } from "utils/GlobalData";

import { KnobTitle } from "../SharedComponents";
import { KnobDisabled } from "../KnobStyles";

const scdStaticImages = `${getStaticRootPath()}/fcd/images`;
const StepPlus = `${scdStaticImages}/step-plus.png`;
const StepMinus = `${scdStaticImages}/step-minus.png`;

// ========================================================================== //
//                                                                            //
//                           Helper Function(s)                               //
//                                                                            //
// ========================================================================== //

const getMax = (marks) => Object.keys(marks).length - 1;

// Regex replaces a space with a non-breaking space to keep label on one line
const formatLabel = (value) => value.replace(" ", " ");

const isLabelHidden = (index, choices, longLabels) => {
  const numOfChoices = choices.length - 1;
  const numChoicesIsEven = choices.length % 2 === 0;
  const indexIsEven = index % 2 === 0;
  if (longLabels) {
    return index !== 0 && index !== numOfChoices;
  }
  if (numOfChoices <= 8) {
    return false;
  }
  if (numOfChoices <= 16) {
    return indexIsEven === numChoicesIsEven;
  }
  return index !== 0 && index !== numOfChoices;
};

const createMarkLabel = (
  value,
  selectedValue,
  knobDefault,
  isHidden,
  noTickMark,
  tickWidth,
  longLabels
) => ({
  label: (
    <Label
      value={value}
      selectedValue={selectedValue}
      knobDefault={knobDefault}
      isHidden={isHidden}
      noTickMark={noTickMark}
      tickWidth={tickWidth}
      longLabels={longLabels}
    />
  ),
});

// ========================================================================== //
//                                                                            //
//                             Styled Components                              //
//                                                                            //
// ========================================================================== //

const LOCAL_COLOR = {
  SliderBackground: PALETTE.GrayAA,
  LabelBackground: PALETTE.Gray66,
  LabelGrey: "#7C7C7C",
  LabelHover: PALETTE.Gray2C,
  HandleColor: PALETTE.white,
  HandleBorder: "#8a8a8a",
  DotColor: "#BBB",
};

const StepperWrapper = styled.div`
  display: flex;
`;

const StepperButton = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  height: 16px;
  justify-content: center;
  opacity: 0.7;
  margin-top: 28px;
  padding: 10px 0 15px 0;
  user-select: none;
  width: 14px;
  z-index: 10;
  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`;

/*
  NOTE: We are hijacking ones of Ant Design's classes here as a slightly
  dirty trick to force the "active" label to always render above its neighbors.
  We also hijack their "disabled" class to neutralize its styling.
*/
const SliderWrapper = styled.div`
  flex: 1;
  padding: 32px 12px 10px;
  user-select: none;
  .rc-slider-mark-text-active {
    z-index: 10;
  }
  .rc-slider-disabled {
    background-color: transparent;
  }
`;

const fadeInFromNone = keyframes`
  0% {
    display: none;
    opacity: 0;
  }
  1% {
    display: block;
    opacity: 0;
    transform: translateX(-50%) scale(0.5);
  }
  100% {
    display: block;
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
`;

const LabelWrapper = styled.div`
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  top: -45px;
`;

const LabelText = styled.div`
  display: flex;
  color: ${LOCAL_COLOR.LabelGrey};
  justify-content: center;
  padding: 0 ${(props) => props.tickWidth / 2}px;
  max-width: ${(props) => props.tickWidth + 10}px;
  font-size: ${FONT_SIZE.ExtraSmall};
  padding-bottom: 30px;
  visibility: ${(props) => (props.longLabels || props.noTickMark) && "hidden"};
  &:hover {
    color: ${LOCAL_COLOR.LabelHover};
  }
`;

const ActiveLabelText = styled(LabelText)`
  background-color: ${LOCAL_COLOR.LabelBackground};
  border-radius: 3px;
  color: ${PALETTE.White};
  font-size: ${FONT_SIZE.Small};
  font-weight: ${FONT_WEIGHTS.Medium};
  line-height: 1;
  margin-top: -3px;
  max-width: none;
  padding: 3px 5px;

  &:hover {
    color: ${PALETTE.White};
  }
`;

const DefaultLabel = styled(LabelText)`
  &:after {
    color: ${LOCAL_COLOR.DotColor};
    content: "•";
    font-size: 25px;
    left: 50%;
    position: absolute;
    top: 30px;
    transform: translateX(-50%);
    animation: ${fadeInFromNone} 0.2s ease-out;
    visibility: visible;
  }
`;

const HiddenLabelText = styled(LabelText)`
  color: transparent;
`;

const TickMark = styled.div`
  background-color: ${LOCAL_COLOR.SliderBackground};
  position: absolute;
  height: 10px;
  left: 50%;
  top: 24px;
  transform: translateX(-50%);
  width: 1px;
  z-index: 10;
`;

const HalfTickMark = styled(TickMark)`
  height: 6px;
  top: 27px;
`;

// ========================================================================== //
//                                                                            //
//                              Other Styles                                  //
//                                                                            //
// ========================================================================== //

/*
  Ant Design allows us to style some aspects of their slider component via
  inline styles passed in as objects. Note that because these are inline,
  we can't use CSS selectors or pseudo-classes here. Documentation:
  https://github.com/react-component/slider
  https://ant.design/components/slider/
*/

const railStyle = {
  backgroundColor: LOCAL_COLOR.SliderBackground,
  borderRadius: "0px",
  height: "3px",
  zIndex: "0",
};

const dotStyle = {
  display: "none",
};

const handleStyle = {
  backgroundColor: LOCAL_COLOR.HandleColor,
  border: `1px solid ${LOCAL_COLOR.HandleBorder}`,
  bottom: "0px",
  boxSizing: "border-box",
  borderRadius: "3px",
  height: "18px",
  transform: "translateX(-8%)", // this is a fix for the handle being off-center
  width: "17px",
  zIndex: "50",
};

// ========================================================================== //
//                                                                            //
//                             Main Component                                 //
//                                                                            //
// ========================================================================== //

export default class BaseSlider extends React.Component {
  static propTypes = {
    choices: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string,
        displayValue: PropTypes.string,
        handleChange: PropTypes.func,
      })
    ),
    displayName: PropTypes.string,
    knobDefault: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    longLabels: PropTypes.bool,
    selected: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({ displayName: PropTypes.string }),
    ]).isRequired,
    tooltip: PropTypes.string,
    disabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    displayName: "",
    choices: [],
    longLabels: false,
    tooltip: "",
  };

  /*
  Returns an object mapping linear indexes (0, 1, 2, ect) to a <Label> component
  for each choice. Used by Ant Design slider for displaying custom labels.
  */
  getMarksFromChoices = () => {
    const { choices, selected, knobDefault, longLabels } = this.props;
    const selectedValue = formatLabel(selected.displayValue);
    const marks = { ...choices };
    const calculatedTickWidth = Math.floor(
      300 / Object.keys(choices).length - 1
    );
    const tickWidth = Math.max(calculatedTickWidth, 6);
    const choicesKeys = Object.keys(choices);
    choicesKeys.forEach((key) => {
      const value = formatLabel(choices[key].displayValue);
      const isHidden = isLabelHidden(parseInt(key, 10), choices, longLabels);
      const noTickMark = isHidden && choicesKeys.length - 1 > 20;
      marks[key] = createMarkLabel(
        value,
        selectedValue,
        knobDefault,
        isHidden,
        noTickMark,
        tickWidth,
        longLabels
      );
    });
    return marks;
  };

  getStartingValue = () => {
    const selectedChoice = this.props.selected;
    return this.props.choices.indexOf(selectedChoice);
  };

  selectChoice = (value) => {
    const choice = this.props.choices[value];
    choice.handleChange();
  };

  incrementOrDecrementChoice = (direction) => {
    const selectedChoiceIndex = this.props.choices.indexOf(this.props.selected);
    if (this.props.choices[selectedChoiceIndex + direction]) {
      this.selectChoice(selectedChoiceIndex + direction);
    }
  };

  render() {
    const { displayName, tooltip, disabled } = this.props;
    const marks = this.getMarksFromChoices();
    return (
      <VStack gap="0.8rem">
        {displayName && (
          <KnobTitle
            displayName={displayName}
            tooltip={tooltip}
            disabled={disabled}
          />
        )}
        <KnobDisabled disabled={disabled}>
          <StepperWrapper>
            <Stepper
              iconSrc={StepMinus}
              onClick={() => this.incrementOrDecrementChoice(-1)}
            />
            <SliderWrapper>
              <Slider
                value={this.getStartingValue()}
                dots
                dotStyle={dotStyle}
                handleStyle={handleStyle}
                included={false}
                marks={marks}
                max={getMax(marks)}
                min={0}
                onChange={(value) => this.selectChoice(value)}
                railStyle={railStyle}
                tooltipVisible={false}
                disabled={disabled}
              />
            </SliderWrapper>
            <Stepper
              iconSrc={StepPlus}
              onClick={() => this.incrementOrDecrementChoice(1)}
            />
          </StepperWrapper>
        </KnobDisabled>
      </VStack>
    );
  }
}

// ========================================================================== //
//                                                                            //
//                             Sub-Component(s)                               //
//                                                                            //
// ========================================================================== //

const Stepper = ({ iconSrc, onClick }) => (
  <StepperButton onClick={onClick}>
    <img alt="" src={iconSrc} />
  </StepperButton>
);

Stepper.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Label = ({
  value,
  selectedValue,
  knobDefault,
  isHidden,
  noTickMark,
  tickWidth,
  longLabels,
}) => {
  if (value === selectedValue) {
    return (
      <LabelWrapper>
        <ActiveLabelText tickWidth={tickWidth}>{value}</ActiveLabelText>
        <TickMark />
      </LabelWrapper>
    );
  }
  if (value === formatLabel(knobDefault.toString())) {
    return (
      <LabelWrapper>
        <DefaultLabel tickWidth={tickWidth} longLabels={longLabels}>
          {value}
        </DefaultLabel>
        <TickMark />
      </LabelWrapper>
    );
  }
  if (noTickMark) {
    return (
      <LabelWrapper>
        <HiddenLabelText tickWidth={tickWidth} />
      </LabelWrapper>
    );
  }
  if (isHidden) {
    return (
      <LabelWrapper>
        <HiddenLabelText tickWidth={tickWidth} longLabels={longLabels}>
          {value}
        </HiddenLabelText>
        <HalfTickMark />
      </LabelWrapper>
    );
  }
  return (
    <LabelWrapper>
      <LabelText tickWidth={tickWidth}>{value}</LabelText>
      <TickMark />
    </LabelWrapper>
  );
};

Label.propTypes = {
  knobDefault: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  isHidden: PropTypes.bool.isRequired,
  noTickMark: PropTypes.bool.isRequired,
  tickWidth: PropTypes.number.isRequired,
  longLabels: PropTypes.bool.isRequired,
};
