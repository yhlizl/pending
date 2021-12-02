import React from "react";
import PropTypes from "prop-types";

import { VStack } from "components/Spacing";
import { KnobRestrictionMessage } from "core-designer/tabpanels/Shared/Components";
import {
  getFormattedHex,
  getHumanReadableSize,
  getTopAddress,
} from "./AddressUtils";
import BaseSlider from "./widgets/BaseSlider";
import {
  PortSizeLabelWrapper,
  BoldKnobName,
  MonospaceTextSpan,
} from "./KnobStyles";
import Knob from "./Knob";
import ValidatorUtil from "./ValidatorUtil";

// ========================================================================== //
//                                                                            //
//                           Helper Function(s)                               //
//                                                                            //
// ========================================================================== //

const getSizeNumbers = (min, max) => {
  const range = [];
  for (let i = min; i <= max; i *= 2) {
    range.push(i);
  }
  return range;
};

// ========================================================================== //
//                                                                            //
//                              Sub-components                                //
//                                                                            //
// ========================================================================== //

const PortSizeLabel = ({ knobName, hex, disabled }) => (
  <PortSizeLabelWrapper>
    <BoldKnobName disabled={disabled}>{knobName}</BoldKnobName>
    <MonospaceTextSpan disabled={disabled}>Hex: {hex}</MonospaceTextSpan>
  </PortSizeLabelWrapper>
);

PortSizeLabel.propTypes = {
  knobName: PropTypes.string.isRequired,
  hex: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
};

// ========================================================================== //
//                                                                            //
//                                 Main Class                                 //
//                                                                            //
// ========================================================================== //

class SizeSliderKnob extends Knob {
  createStateUpdateCallbacks(callback) {
    this.choices = this.createChoices();
    this.choices.forEach((choice) => {
      choice.handleChange = () => {
        const stateUpdate = {
          [this.internalName]: choice.internalValue,
        };
        callback(stateUpdate);
      };
    });
  }

  getFormElements = (webConfig) => {
    const disabled = this.isDisabledByContainer(webConfig);
    return (
      <VStack gap="0.8rem" key={this.internalName}>
        <PortSizeLabel
          knobName="Port Size"
          hex={this.getFormattedHexInB(webConfig)}
          disabled={disabled}
        />
        <BaseSlider
          selected={this.getChoiceWithValue(webConfig[this.internalName])}
          choices={this.choices}
          disabled={disabled}
          knobDefault={getHumanReadableSize(this.defaultValue)}
          longLabels
        />
        {this.showRestrictionMessage(webConfig) && (
          <KnobRestrictionMessage
            restrictionName={this.knobSpec.displayName}
            restrictionValue={this.getRestrictionDisplayValue()}
            extraMessage={this.getRestrictedTopAddressMessage(webConfig)}
          />
        )}
      </VStack>
    );
  };

  // ========================================================================== //
  //                                                                            //
  //                        Unique Method(s) for this Knob                      //
  //                                                                            //
  // ========================================================================== //

  createChoices = () => {
    const values = getSizeNumbers(this.min, this.max);
    const choices = values.map((value) => ({
      displayValue: getHumanReadableSize(value),
      reviewValue: value.toString(),
      internalValue: value,
    }));
    return choices;
  };

  getFormattedHexInB = (webConfig) => {
    const sizeInKiB = webConfig[this.internalName];
    return getFormattedHex(sizeInKiB * 2 ** 10);
  };

  getRestrictedTopAddressMessage = (webConfig) => {
    const baseAddress = webConfig[this.baseKnobId];
    const sizeRestriction = this.getRestrictionValue();
    const topAddress = getTopAddress(baseAddress, sizeRestriction);
    return ` With ${this.getRestrictionDisplayValue()} port size, top address will be
     ${getFormattedHex(topAddress)}.`;
  };

  getChoiceWithValue = (value) => {
    const selected = this.choices.filter((c) => c.internalValue === value);
    if (selected.length !== 1) {
      const msg = `Unexpected value for ${this.internalName}: ${value}`;
      throw new Error(msg);
    }
    return selected[0];
  };

  // ========================================================================== //
  //                                                                            //
  //                           Knob Utility Methods                             //
  //                                                                            //
  // ========================================================================== //

  getDisplayValue = (webConfig) =>
    getHumanReadableSize(webConfig[this.internalName]);

  getBlockDisplayValue = (webConfig) =>
    getHumanReadableSize(webConfig[this.internalName]);

  getDefaultReviewValue = () => {
    if (!super.isDefaultActive()) {
      return "None";
    }
    return getHumanReadableSize(this.defaultValue);
  };

  getDefaultState = () => ({ [this.internalName]: this.defaultValue });

  getReviewValue = (webConfig) => {
    if (this.isDisabledByContainer(webConfig)) {
      return "None";
    }
    return this.getDisplayValue(webConfig);
  };

  isValid = (webConfig) => {
    const currVal = webConfig[this.internalName];
    if (Number.isNaN(currVal)) {
      return false;
    }
    return this.min <= currVal && currVal <= this.max;
  };

  validateKnobSpec = () => {
    ValidatorUtil.baseKnobValidation(this);
    ValidatorUtil.assertHasProperty(this, "min");
    ValidatorUtil.assertHasProperty(this, "max");
    ValidatorUtil.assertHasProperty(this, "defaultValue");
  };
}

export default SizeSliderKnob;
