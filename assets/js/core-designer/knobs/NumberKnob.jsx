import React from "react";

import { ErrorIcon } from "components/Icons";
import WithTooltip from "components/WithTooltip";
import Knob from "./Knob";
import ValidatorUtil from "./ValidatorUtil";
import { HelpIcon, StyledLabel, StyledTextBox, RangeText } from "./KnobStyles";
import { isNumberKnobEnabled } from "./ConstraintUtil";

class NumberKnob extends Knob {
  createStateUpdateCallbacks(callback) {
    this.handleChange = (evt) => {
      evt.preventDefault();
      const num = +evt.target.value;
      const newVal = this.inputMinMax(num);
      if (!Number.isNaN(newVal)) {
        callback({ [this.internalName]: newVal });
      }
    };
  }

  inputMinMax(num) {
    if (num > this.max) {
      return this.max;
    }
    if (num < 0) {
      return this.min;
    }
    return num;
  }

  getDefaultState() {
    return { [this.internalName]: this.defaultValue };
  }

  getFormElements(webConfig) {
    const disabledByContainer = this.isDisabledByContainer(webConfig);
    const isEnabled = isNumberKnobEnabled(this.internalName, webConfig);
    const isValid = this.isValid(webConfig);
    // The inline variant of this component puts the label, input box, and error
    // icon all on one line. Otherwise, the label and error icon appear on one
    // line and the input box on the next.
    const isInline = this.max <= 9999;
    return (
      <div key={this.internalName}>
        <StyledLabel
          isInline={isInline}
          disabled={disabledByContainer || !isEnabled}
        >
          {isInline ? (
            <>
              {this.displayName}
              {isValid || <ErrorIcon isInline />}
            </>
          ) : (
            <div>
              {this.displayName}:
              {this.tooltip && (
                <WithTooltip msg={this.tooltip}>
                  <HelpIcon />
                </WithTooltip>
              )}
            </div>
          )}
          <StyledTextBox
            value={webConfig[this.internalName]}
            onChange={this.handleChange}
            isInline={isInline}
            valid={isValid}
            disabled={disabledByContainer || !isEnabled}
          />
        </StyledLabel>
        {isInline && this.tooltip && (
          <WithTooltip msg={this.tooltip}>
            <HelpIcon />
          </WithTooltip>
        )}
        {!isInline && !isValid && <ErrorIcon isInline />}
        <RangeText disabled={disabledByContainer || !isEnabled}>
          {this.min} - {this.max}, default {this.defaultValue}
        </RangeText>
      </div>
    );
  }

  getDisplayValue(webConfig) {
    return webConfig[this.internalName];
  }

  getBlockDisplayValue(webConfig) {
    return webConfig[this.internalName];
  }

  getReviewValue(webConfig) {
    if (this.isDisabledByContainer(webConfig)) {
      return "None";
    }
    return this.getDisplayValue(webConfig);
  }

  getDefaultReviewValue() {
    if (!super.isDefaultActive()) {
      return "None";
    }
    return this.defaultValue;
  }

  isValid(webConfig) {
    const currVal = webConfig[this.internalName];
    if (this.isDisabledByContainer(webConfig)) {
      return true;
    }
    if (Number.isNaN(currVal)) {
      return false;
    }
    return this.min <= currVal && currVal <= this.max;
  }

  validateKnobSpec() {
    ValidatorUtil.baseKnobValidation(this);
    ValidatorUtil.assertHasProperty(this, "min");
    ValidatorUtil.assertHasProperty(this, "max");
    ValidatorUtil.assertHasProperty(this, "defaultValue");
  }
}

export { NumberKnob };
