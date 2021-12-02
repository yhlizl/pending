import React from "react";
import styled from "styled-components";

import { ErrorIcon } from "components/Icons";
import Knob from "./Knob";
import ValidatorUtil from "./ValidatorUtil";
import { StyledLabel, StyledTextBox } from "./KnobStyles";

const MarginedErrorIcon = styled(ErrorIcon)`
  margin-left: 0.4rem;
`;

class TextKnob extends Knob {
  createStateUpdateCallbacks(callback) {
    this.handleChange = (evt) => {
      evt.preventDefault();
      const val = evt.target.value;
      const isnotnum = Number.isNaN(parseInt(val.charAt(0), 10));
      if (
        (/[^0-9a-zA-Z_]/.test(val) === false && isnotnum === true) ||
        val === ""
      ) {
        callback({ [this.internalName]: val });
      }
    };
  }

  getDefaultState() {
    return { [this.internalName]: this.defaultValue };
  }

  getFormElements(webConfig) {
    const disabled = this.isDisabledByContainer(webConfig);
    const isValid = this.isValid(webConfig);
    return (
      <StyledLabel key={this.internalName} disabled={disabled}>
        {this.displayName}
        {isValid || <MarginedErrorIcon isInline />}
        <StyledTextBox
          value={webConfig[this.internalName]}
          onChange={this.handleChange}
          valid={isValid || !webConfig.has_rtlPrefix}
          disabled={disabled}
        />
      </StyledLabel>
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
    if (currVal === "") {
      return false;
    }
    return true;
  }

  validateKnobSpec() {
    ValidatorUtil.baseKnobValidation(this);
    ValidatorUtil.assertHasProperty(this, "defaultValue");
  }
}

export { TextKnob };
