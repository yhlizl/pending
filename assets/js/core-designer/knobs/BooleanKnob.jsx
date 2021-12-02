import React from "react";
import styled, { css } from "styled-components";
import { transparentize } from "polished";
import { FaPencilAlt } from "react-icons/fa";

import { ErrorIcon } from "components/Icons";
import { OLD_COLOR, FONT_SIZE, LINE_HEIGHT } from "components/StyledComponents";
import Checkbox from "components/Checkbox";
import { VStack } from "components/Spacing";
import WithTooltip from "components/WithTooltip";
import { PALETTE, COLOR } from "utils/StyleConstants";
import {
  KnobInfoMessage,
  KnobRestrictionMessage,
} from "core-designer/tabpanels/Shared/Components";
import {
  isBoolKnobEnabled,
  boolChangesOtherKnobs,
  shouldKnobBeRendered,
} from "./ConstraintUtil";
import { HelpIcon, MonospaceTextSpan } from "./KnobStyles";
import Knob from "./Knob";
import ValidatorUtil from "./ValidatorUtil";

const LOCAL_COLOR = {
  BorderedDivBorder: OLD_COLOR.GrayCC,
  AbsoluteDivBackground: PALETTE.White,
  StyledPencil: OLD_COLOR.GrayBD,
  StyledPencilHover: OLD_COLOR.Gray88,
  KnobSubsectionLabel: OLD_COLOR.Gray88,
  KnobEditSubsectionDone: transparentize(0.3, COLOR.PrimaryBrand),
  KnobEditSubsectionTitleBarBackground: OLD_COLOR.GrayCC,
  KnobEditSubsectionTitleBar: OLD_COLOR.Gray44,
  KnobEditSubsectionBackground: PALETTE.GrayF0,
  KnobEditSubsectionBorder: PALETTE.GrayCC,
  KnobSubsectionBorderBottom: PALETTE.GrayF0,
};

const BorderedDivWrapper = styled.div`
  display: grid;
  grid-row-gap: 1.6rem;
  padding-top: 1.2rem;
`;

const BorderedDiv = styled.div`
  position: relative;
  border: 1px solid ${LOCAL_COLOR.BorderedDivBorder};
  padding: 3.2rem 2.4rem;
`;

const AbsoluteDiv = styled.div`
  font-weight: 500;
  position: absolute;
  display: inline-block;
  top: 0;
  left: -0.2rem;
  background-color: ${PALETTE.GrayF0};
  padding: 1.6rem 1rem 1.6rem 0;
  transform: translateY(-50%);
  z-index: 100;
  ${BorderedDiv} ${BorderedDiv} & {
    z-index: 10;
  }
`;

const CheckboxTooltipWrapper = styled.div`
  display: flex;
`;

const DescriptionText = styled.div`
  font-size: ${FONT_SIZE.Small};
  line-height: ${LINE_HEIGHT.Giant};
`;

const KnobSubsection = styled.div`
  font-size: ${FONT_SIZE.Small};
  line-height: ${LINE_HEIGHT.Giant};

  &:not(:last-child) {
    border-bottom: 1px solid ${LOCAL_COLOR.KnobSubsectionBorderBottom};
  }
`;

const KnobEditSubsection = styled(KnobSubsection)`
  background-color: ${LOCAL_COLOR.KnobEditSubsectionBackground};
  border: 1px solid ${LOCAL_COLOR.KnobEditSubsectionBorder};
  border-radius: 3px;
`;

const KnobEditSubsectionTitleBar = styled.div`
  background-color: ${LOCAL_COLOR.KnobEditSubsectionTitleBarBackground};
  color: ${LOCAL_COLOR.KnobEditSubsectionTitleBar};
  display: flex;
  justify-content: space-between;
`;

const KnobEditSubsectionTitle = styled.div`
  padding: 0.4rem 1rem 0.5rem;
  font-weight: 500;
`;

const KnobEditSubsectionDone = styled.a`
  color: ${LOCAL_COLOR.KnobEditSubsectionDone};
  padding: 0.4rem 1rem 0.5rem;
  text-align: right;
  cursor: pointer;
  font-weight: 700;
`;

const KnobEditSubsectionContent = styled.div`
  display: grid;
  grid-row-gap: 1.6rem;
  padding: 2rem;
`;

const KnobSubsectionRow = styled.div`
  display: flex;
  justify-content: space-between;
  ${(props) => !props.disabled && "cursor: pointer"};
`;

const KnobSubsectionLabel = styled.div`
  flex-basis: 35%;
  text-align: right;
  color: ${LOCAL_COLOR.KnobSubsectionLabel};
`;

const KnobSubsectionValue = styled.div`
  flex-basis: 45%;
  ${(props) => props.disabled && `color: ${PALETTE.GrayAA};`}
`;

const KnobSubsectionEdit = styled.a`
  flex-basis: 16%;
`;

const StyledPencil = styled(FaPencilAlt)`
  color: ${LOCAL_COLOR.StyledPencil};
  position: relative;
  top: 0;
  display: inline-block;
  margin-left: 1rem;
  vertical-align: middle;

  ${(props) =>
    /* The double ampersand in the CSS selector below is not a typo; it is
     * necessary in order for the dynamic CSS (dynamic as in it changes based on
     * the props) to only apply for a particular setting of props. It is not
     * clear whether this is considered a bug in styled-components 5.2 or an
     * accidental but not well documented breaking change in 5.2.
     *
     * https://github.com/styled-components/styled-components/issues/3376
     */
    !props.disabled &&
    css`
      ${KnobSubsection}:hover && {
        color: ${LOCAL_COLOR.StyledPencilHover};
      }
    `}
`;

const KnobSubsectionError = styled(ErrorIcon)`
  margin-left: 0.25em;
`;

class BooleanKnob extends Knob {
  createStateUpdateCallbacks(callback) {
    this.handleChange = (el, webConfig, insideSubsection) => {
      const { checked } = el.target;
      // Collapse the edit menu when you click on some other knob
      // only called if this is not inside a subsection
      if (!insideSubsection && webConfig.onTabSubsectionClick) {
        webConfig.onTabSubsectionClick(this.internalName, "");
      }
      let stateUpdate = {
        [this.internalName]: checked,
      };
      stateUpdate = boolChangesOtherKnobs(
        stateUpdate,
        this.internalName,
        checked,
        this.ipSeries
      );
      callback(stateUpdate);

      if (this.internalName === "has_rtlPrefix" && checked === false) {
        callback({ customizePrefix: "SiFive_", has_rtlPrefix: false });
      }
    };
  }

  shouldContainedKnobsBeDisabled(webConfig) {
    return (
      this.isDisabledByContainer(webConfig) || !webConfig[this.internalName]
    );
  }

  isDefaultActive() {
    return super.isDefaultActive() && this.getDefaultChoice().internalValue;
  }

  getFormElements(webConfig) {
    if (this.contains.length > 0) {
      return this.getHeirarchicalCheckbox(webConfig);
    }
    return this.getStandardCheckbox(webConfig, {
      isHierarchicalContainer: false,
    });
  }

  getStandardCheckbox(webConfig, { isHierarchicalContainer }) {
    const isEnabled = isBoolKnobEnabled(this.internalName, this.ipSeries);
    const isDisabledByContainer = this.isDisabledByContainer(webConfig);
    const userModeWithoutPMP =
      this.internalName === "has_user_mode" && !webConfig.has_pmp;
    const disabled =
      this.choices.length < 2 || !isEnabled || isDisabledByContainer;

    // We pass this.containedBySubsection to this.handleChange(...) function
    // to indicate the checkbox is inside a subsection or not.
    // If it is undefined/null/empty string, it is not inside a subsection.
    return (
      <React.Fragment key={this.internalName}>
        <CheckboxTooltipWrapper>
          <Checkbox
            checked={webConfig[this.internalName]}
            disabled={disabled}
            isBold={isHierarchicalContainer}
            label={this.displayName}
            onChange={(e) =>
              this.handleChange(e, webConfig, this.containedBySubsection)
            }
          />
          {!this.tooltip || (
            <WithTooltip msg={this.tooltip}>
              <HelpIcon />
            </WithTooltip>
          )}
        </CheckboxTooltipWrapper>
        {userModeWithoutPMP && <UserModeMessage />}
      </React.Fragment>
    );
  }

  getHeirarchicalCheckbox(webConfig) {
    const userModeWithoutPMP =
      this.internalName === "has_pmp" && !webConfig.has_pmp;
    return (
      <BorderedDivWrapper key={this.internalName}>
        <BorderedDiv>
          <AbsoluteDiv>
            {this.getStandardCheckbox(webConfig, {
              isHierarchicalContainer: true,
            })}
          </AbsoluteDiv>
          <VStack gap="2rem">{this.getContainedKnobs(webConfig)}</VStack>
        </BorderedDiv>
        {userModeWithoutPMP && <PMPInfoBox />}
        {this.description && (
          <DescriptionText>{this.description}</DescriptionText>
        )}
      </BorderedDivWrapper>
    );
  }

  getReadWriteSubsection(webConfig, subsectionName) {
    const knobFails = [];
    const knobEls = this.contains
      .filter(
        (knob) =>
          knob.containedBySubsection === subsectionName &&
          shouldKnobBeRendered(knob.internalName)
      )
      .map((knob) => {
        const overlaps = knob.overlapsWith(webConfig);
        if (overlaps) {
          overlaps.forEach((el) => knobFails.push(el));
        }
        return knob.getFormElements(webConfig);
      });
    return (
      <KnobEditSubsection>
        <KnobEditSubsectionTitleBar>
          <KnobEditSubsectionTitle>
            Edit {subsectionName}
          </KnobEditSubsectionTitle>
          <KnobEditSubsectionDone
            onClick={() =>
              webConfig.onTabSubsectionClick(this.internalName, "")
            }
          >
            Done Editing
          </KnobEditSubsectionDone>
        </KnobEditSubsectionTitleBar>
        <KnobEditSubsectionContent>
          {knobEls}
          {knobFails}
        </KnobEditSubsectionContent>
      </KnobEditSubsection>
    );
  }

  getReadOnlySubsection(webConfig, subsectionName) {
    let isFirst = true;
    return this.contains
      .filter(
        (knob) =>
          knob.containedBySubsection === subsectionName &&
          shouldKnobBeRendered(knob.internalName)
      )
      .map((knob) => {
        const isValid = knob.isValid(webConfig);
        const disabled = knob.isDisabledByContainer(webConfig);
        let editIcon = null;
        if (isFirst) {
          editIcon = <StyledPencil disabled={disabled} />;
          isFirst = false;
        }
        // HACK: The gap size set on the VStack component probably doesn't work
        // outside of the current only scenario where this component appears,
        // which is in a port size restriction. The issue is that the intended
        // visual hierarchy doesn't match the DOM hierarchy in that we want the
        // restriction message to appear further away from the actual knob than
        // other knobs.
        return (
          <VStack gap="1.2em" key={knob.internalName}>
            <KnobSubsectionRow disabled={disabled}>
              <KnobSubsectionLabel>{knob.displayName}:</KnobSubsectionLabel>
              <KnobSubsectionValue valid={isValid} disabled={disabled}>
                {knob.displayName === "Base Address" ? (
                  <MonospaceTextSpan>
                    {knob.getDisplayValue(webConfig)}
                  </MonospaceTextSpan>
                ) : (
                  knob.getDisplayValue(webConfig)
                )}
                {!isValid && !disabled && <KnobSubsectionError isInline />}
              </KnobSubsectionValue>
              <KnobSubsectionEdit>{editIcon}</KnobSubsectionEdit>
            </KnobSubsectionRow>
            {knob.showRestrictionMessage(webConfig) && (
              <KnobRestrictionMessage
                restrictionName={knob.knobSpec.displayName}
                restrictionValue={knob.getRestrictionDisplayValue()}
              />
            )}
          </VStack>
        );
      });
  }

  getKnobsForSubsection(webConfig, subsectionName) {
    const knobIsActive = webConfig.activeTabKnob === this.internalName;
    const subsectionIsActive = webConfig.activeTabSubsection === subsectionName;
    if (knobIsActive && subsectionIsActive) {
      return (
        <KnobSubsection key={subsectionName}>
          {this.getReadWriteSubsection(webConfig, subsectionName)}
        </KnobSubsection>
      );
    }
    let onClick;
    if (!this.shouldContainedKnobsBeDisabled(webConfig)) {
      onClick = () => {
        webConfig.onTabSubsectionClick(this.internalName, subsectionName);
      };
    }
    return (
      <KnobSubsection key={subsectionName} onClick={onClick}>
        {this.getReadOnlySubsection(webConfig, subsectionName)}
      </KnobSubsection>
    );
  }

  getContainedKnobs(webConfig) {
    if (!this.subsections) {
      return this.contains.map((k) => (
        <VStack gap="1.2rem" key={k.internalName}>
          {k.getFormElements(webConfig)}
        </VStack>
      ));
    }
    return this.subsections.map((name) =>
      this.getKnobsForSubsection(webConfig, name)
    );
  }

  validateKnobSpec() {
    ValidatorUtil.baseKnobValidation(this);
    ValidatorUtil.assertHasProperty(this, "choices");
    this.choices.forEach((choice) => ValidatorUtil.validateChoiceSpec(choice));
    this.getDefaultChoice();
    this.choices.forEach((choice) => {
      if (typeof choice.internalValue !== typeof true) {
        throw new Error(
          `BooleanKnob ${this.internalName} with non-boolean ` +
            `internalValue: ${choice.internalValue}`
        );
      }
    });
  }

  getDefaultState() {
    return { [this.internalName]: this.getDefaultChoice().internalValue };
  }

  getDisplayValue(webConfig) {
    const currVal = webConfig[this.internalName];
    const choice = this.getValidatedInternalValue(currVal);
    return choice.displayValue;
  }

  getBlockDisplayValue(webConfig) {
    const currVal = webConfig[this.internalName];
    const choice = this.getUnvalidatedInternalValue(currVal);

    if (choice.diagramValue) {
      return choice.diagramValue;
    }
    return choice.displayValue;
  }

  getReviewValue(webConfig) {
    if (this.isDisabledByContainer(webConfig)) {
      return "None";
    }
    const currVal = webConfig[this.internalName];
    const choice = this.getUnvalidatedInternalValue(currVal);
    return choice.reviewValue;
  }

  getDefaultReviewValue() {
    if (!super.isDefaultActive()) {
      return "None";
    }
    return this.getDefaultChoice().reviewValue;
  }

  getDefaultChoice() {
    const defaultChoices = this.choices.filter(
      (c) => c.internalValue === this.defaultValue
    );

    if (defaultChoices.length !== 1) {
      throw new Error(
        `Boolean knob ${this.internalName} missing default choice`
      );
    }

    return defaultChoices[0];
  }

  // Softly fail released cores with invalid values, will return something usable
  getUnvalidatedInternalValue(internalVal) {
    const selected = this.choices.filter(
      (c) => c.internalValue === internalVal
    );
    if (selected.length !== 1) {
      return { diagramValue: internalVal, reviewValue: internalVal };
    }
    return selected[0];
  }

  // Hard fail for draft cores with invalid values, will error because of invalid val
  getValidatedInternalValue(internalVal) {
    const selected = this.choices.filter(
      (c) => c.internalValue === internalVal
    );
    if (selected.length !== 1) {
      const msg = `Unexpected value for ${this.internalName}: ${internalVal}`;
      throw new Error(msg);
    }
    return selected[0];
  }
}

const UserModeMessage = () => (
  <KnobInfoMessage boldMessage="PMP disabled.">
    Physical Memory Protection is only available when User Mode is enabled.
  </KnobInfoMessage>
);

const PMPInfoBox = () => (
  <KnobInfoMessage boldMessage="User Mode disabled.">
    User Mode is only available when Physical Memory Protection is enabled.
  </KnobInfoMessage>
);

export default BooleanKnob;
