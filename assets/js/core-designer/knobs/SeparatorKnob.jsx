import React from "react";
import Knob from "./Knob";
import ValidatorUtil from "./ValidatorUtil";
import { SeparatorLabel } from "./KnobStyles";

/*
 * Separates Knobs with a static text followed by new line. The json file
 * should provide type="separator", displayName=static text to display on
 * the knob, internalName=unique text id, containedById= parent knob
 * Also knob_matches_choices function in knobs.py must have proper type
 * defined for every knob type including seperator knob type
 * defaults.json should contain the
 */
class SeparatorKnob extends Knob {
  createStateUpdateCallbacks(_callback) {
    this.handleChange = (evt) => {
      evt.preventDefault();
    };
  }

  getDefaultState() {
    return { [this.internalName]: this.defaultValue };
  }

  getFormElements(_webConfig) {
    return (
      <SeparatorLabel key={this.internalName}>
        {this.displayName}
      </SeparatorLabel>
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

export default SeparatorKnob;
