import React from "react";
import { KnobRestrictionMessage } from "core-designer/tabpanels/Shared/Components";
import { getFormattedHex, getTopAddress } from "./AddressUtils";
import Knob from "./Knob";
import BaseSlider from "./widgets/BaseSlider";
import ValidatorUtil from "./ValidatorUtil";
import {
  radioKnobChangesOtherKnobs,
  isEntireKnobDisabled,
} from "./ConstraintUtil";

// ========================================================================== //
//                                                                            //
//                                 Main Class                                 //
//                                                                            //
// ========================================================================== //

class RadioSliderKnob extends Knob {
  createStateUpdateCallbacks(callback) {
    this.choices.forEach((choice) => {
      choice.handleChange = () => {
        let stateUpdate = {
          [this.internalName]: choice.internalValue,
        };
        stateUpdate = radioKnobChangesOtherKnobs(
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
          selected={this.getValidatedChoiceWithInternalValue(
            webConfig[this.internalName]
          )}
          choices={this.choices}
          knobDefault={this.defaultValue}
          disabled={
            isEntireKnobDisabled(this.internalName) ||
            this.isDisabledByContainer(webConfig)
          }
        />
        {this.showRestrictionMessage(webConfig) && (
          <KnobRestrictionMessage
            restrictionName={this.knobSpec.reviewName}
            restrictionValue={this.getRestrictionDisplayValue()}
            extraMessage={this.getRestrictedTopAddressMessage(webConfig)}
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

  getRestrictedTopAddressMessage(webConfig) {
    if (
      !this.baseKnobId ||
      (this.internalName === "dtim_size" && !webConfig.has_dtim)
    ) {
      return null;
    }

    const baseAddress = webConfig[this.baseKnobId];
    const restrictionSize = this.getRestrictionValue();
    const topAddress = getTopAddress(baseAddress, restrictionSize);

    return ` With ${this.getRestrictionDisplayValue()} size, top address will be
    ${getFormattedHex(topAddress)}.`;
  }

  // ========================================================================== //
  //                                                                            //
  //                           Knob Utility Methods                             //
  //                                                                            //
  // ========================================================================== //

  getDefaultState() {
    return { [this.internalName]: this.getDefaultChoice().internalValue };
  }

  getDisplayValue(webConfig) {
    const currVal = webConfig[this.internalName];
    const choice = this.getValidatedChoiceWithInternalValue(currVal);
    return choice.displayValue;
  }

  getBlockDisplayValue(webConfig) {
    const currVal = webConfig[this.internalName];
    const choice = this.getUnvalidatedChoiceWithInternalValue(currVal);

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
    const choice = this.getUnvalidatedChoiceWithInternalValue(currVal);
    return choice.reviewValue;
  }

  getDefaultReviewValue() {
    if (!super.isDefaultActive()) {
      return "None";
    }
    return this.getDefaultChoice().reviewValue;
  }

  validateKnobSpec() {
    ValidatorUtil.baseKnobValidation(this);
    ValidatorUtil.assertHasProperty(this, "choices");
    this.choices.forEach((choice) => ValidatorUtil.validateChoiceSpec(choice));
    this.getDefaultChoice();
  }

  getDefaultChoice() {
    const defaultChoices = this.choices.filter(
      (c) => c.internalValue === this.defaultValue
    );
    if (defaultChoices.length !== 1) {
      throw new Error(
        `Radio Slider knob ${this.internalName} missing default choice`
      );
    }

    return defaultChoices[0];
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

export default RadioSliderKnob;
