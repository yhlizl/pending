import React from "react";

import { KnobRestrictionMessage } from "core-designer/tabpanels/Shared/Components";
import Knob from "./Knob";
import SegmentedSelector from "./widgets/SegmentedSelector";
import ValidatorUtil from "./ValidatorUtil";
import {
  radioKnobChangesOtherKnobs,
  getDisabledRadioChoices,
  isEntireKnobDisabled,
} from "./ConstraintUtil";

class RadioKnob extends Knob {
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

  isHiddenDcacheAssoc(webConfig) {
    return this.internalName === "dcache_assoc" && webConfig.has_dtim;
  }

  getFormElements(webConfig) {
    // If this is the Dcache assoc, and Dcache isn't enabled, hide this.
    if (this.isHiddenDcacheAssoc(webConfig)) {
      return <div />;
    }
    const disabled =
      isEntireKnobDisabled(this.internalName) ||
      this.isDisabledByContainer(webConfig);

    return (
      <React.Fragment key={`${this.displayName}-container`}>
        <SegmentedSelector
          key={this.internalName}
          displayName={this.displayName}
          tooltip={this.tooltip}
          selected={this.getSelectedValue(webConfig)}
          choices={this.choices}
          designHasDtim={Boolean(webConfig.has_dtim)}
          internalName={this.internalName}
          disabledChoices={getDisabledRadioChoices({
            knobName: this.internalName,
            ipSeries: this.ipSeries,
          })}
          disabled={disabled}
        />
        {this.showRestrictionMessage(webConfig) && (
          <KnobRestrictionMessage
            restrictionName={this.knobSpec.reviewName}
            restrictionValue={this.getRestrictionDisplayValue()}
          />
        )}
      </React.Fragment>
    );
  }

  getDefaultState() {
    return { [this.internalName]: this.getDefaultChoice().internalValue };
  }

  getSelectedValue(webConfig) {
    const currVal = webConfig[this.internalName];
    // Will cause an error if an invalid value is selected
    this.getValidatedInternalValue(currVal);
    return currVal;
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
      throw new Error(`Radio knob ${this.internalName} missing default choice`);
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

export default RadioKnob;
