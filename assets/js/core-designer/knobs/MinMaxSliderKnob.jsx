import React from "react";
import { KnobRestrictionMessage } from "core-designer/tabpanels/Shared/Components";
import Knob from "./Knob";
import BaseSlider from "./widgets/BaseSlider";
import ValidatorUtil from "./ValidatorUtil";
import {
  isEntireKnobDisabled,
  minMaxSliderChangesOtherKnobs,
} from "./ConstraintUtil";

// ========================================================================== //
//                                                                            //
//                           Helper Function(s)                               //
//                                                                            //
// ========================================================================== //

const getNumberRange = (min, max, steps = 1) => {
  const range = [];
  for (let i = min; i <= max; i += steps) {
    range.push(i);
  }
  return range;
};

// ========================================================================== //
//                                                                            //
//                                 Main Class                                 //
//                                                                            //
// ========================================================================== //

class MinMaxSliderKnob extends Knob {
  createStateUpdateCallbacks(callback) {
    this.choices = this.createChoices();

    this.choices.forEach((choice) => {
      choice.handleChange = () => {
        let stateUpdate = {
          [this.internalName]: choice.internalValue,
        };

        stateUpdate = minMaxSliderChangesOtherKnobs(
          choice,
          stateUpdate,
          this.internalName,
          this.ipSeries
        );
        callback(stateUpdate);
      };
    });
  }

  getFormElements(webConfig) {
    return (
      <React.Fragment key={`${this.displayName}-container`}>
        <BaseSlider
          displayName={this.displayName}
          tooltip={this.tooltip}
          selected={this.getCurrentChoice(webConfig)}
          choices={this.choices}
          knobDefault={this.defaultValue}
          disabled={
            isEntireKnobDisabled(this.internalName) ||
            this.isDisabledByContainer(webConfig)
          }
        />
        {this.showRestrictionMessage(webConfig) && (
          <KnobRestrictionMessage
            restrictionName={this.knobSpec.displayName}
            restrictionValue={this.getRestrictionDisplayValue()}
          />
        )}
      </React.Fragment>
    );
  }

  // ========================================================================== //
  //                                                                            //
  //                        Unique Method(s) for this Knob                      //
  //                                                                            //
  // ========================================================================== //

  createChoices() {
    const values = getNumberRange(this.min, this.max, this.steps);
    const choices = values.map((value) => ({
      displayValue: value.toString(),
      reviewValue: value.toString(),
      internalValue: value,
    }));
    return choices;
  }

  // ========================================================================== //
  //                                                                            //
  //                           Knob Utility Methods                             //
  //                                                                            //
  // ========================================================================== //

  getDefaultState() {
    return { [this.internalName]: this.defaultValue };
  }

  getCurrentChoice(webConfig) {
    return this.getValidatedChoiceWithInternalValue(
      webConfig[this.internalName]
    );
  }

  getDisplayValue(webConfig) {
    if (this.choices) {
      const choice = this.getCurrentChoice(webConfig);
      return choice.displayValue;
    }
    return webConfig[this.internalName];
  }

  getBlockDisplayValue(webConfig) {
    if (this.choices) {
      const choice = this.getUnvalidatedChoiceWithInternalValue(
        webConfig[this.internalName]
      );
      return choice.displayValue;
    }
    return webConfig[this.internalName];
  }

  getReviewValue(webConfig) {
    if (this.isDisabledByContainer(webConfig)) {
      return "None";
    }
    return webConfig[this.internalName];
  }

  getDefaultReviewValue() {
    if (!super.isDefaultActive()) {
      return "None";
    }
    return this.defaultValue;
  }

  validateKnobSpec() {
    ValidatorUtil.baseKnobValidation(this);
    ValidatorUtil.assertHasProperty(this, "min");
    ValidatorUtil.assertHasProperty(this, "max");
    ValidatorUtil.assertHasProperty(this, "defaultValue");
  }

  getUnvalidatedChoiceWithInternalValue(internalVal) {
    const selected = this.choices.filter(
      (c) => c.internalValue === internalVal
    );
    if (selected.length !== 1) {
      return { diagramValue: internalVal, reviewValue: internalVal };
    }
    return selected[0];
  }

  getValidatedChoiceWithInternalValue(internalVal) {
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

export default MinMaxSliderKnob;
