// eslint-disable-next-line max-classes-per-file
import React from "react";
import styled from "styled-components";

import { getMemoryMapOverlaps } from "core-designer/MemoryMapHelpers";
import { VStack } from "components/Spacing";
import { FONT_SIZE } from "components/StyledComponents";
import { ErrorMessage } from "components/MessageComponents";
import { WebConfigType } from "utils/Types";

import {
  getAlignmentBitsFromSize,
  getFormattedHex,
  getTopAddress,
} from "./AddressUtils";
import { getAddressableBitsForConfig } from "./ConstraintUtil";

import Address, { partialReadonlyFactor } from "./widgets/Address";
import ValidatorUtil from "./ValidatorUtil";
import Knob from "./Knob";
import { PerCoreMemoryMessage } from "./PerCoreMemoryMessage";
import { SupplementalText, HexAddressNotes, BoldKnobName } from "./KnobStyles";
// Styles

const LabeledAddressContainer = styled(VStack).attrs({ gap: "0.8rem" })`
  font-size: ${FONT_SIZE.Small};
`;

const LabeledAddressContents = styled.div`
  display: flex;
`;

// Base Component
abstract class BaseTopAddressKnob extends Knob {
  // TODO: Remove ! type assertion after refactoring Knob class. When the
  // strictPropertyInitialization option is enabled in TypeScript, it wants to
  // strictly enforce that all non-optional properties are initialized in the
  // constructor of a class. In our case, the KnobUtility.hydrateKnobs()
  // function sets this property. This is indeed very obtuse and difficult for
  // even humans to understand, so hopefully this can be refactored so that the
  // type assertion is unnecessary.
  sizeKnob!: Knob;

  handleChange?: (newValue: number, webConfig: WebConfigType) => void;

  abstract getSelectableAddressRangeForConfig(
    webConfig: any
  ): { start: number; end: number };

  abstract shouldClamp(): boolean;

  createStateUpdateCallbacks(
    callback: (webConfig: Partial<WebConfigType>) => void
  ) {
    this.handleChange = (newState, webConfig) => {
      const { start, end } = this.getSelectableAddressRangeForConfig(webConfig);
      if (start <= newState && newState < end) {
        callback({ [this.internalName]: newState });
      }
    };
  }

  getFormElements(webConfig: WebConfigType) {
    const name = this.timName();
    const base = webConfig[this.internalName] as number;
    const size = webConfig[`${name}_size`] as number;
    const top = getTopAddress(base, size);
    const alignmentBits = getAlignmentBitsFromSize(size * 1024);
    const readonlyFactor = partialReadonlyFactor(alignmentBits);
    // If the min and max are the same, the knob is locked in place and
    //   this knob should be displayed readonly.
    const hasRestrictedMiddleDigit = readonlyFactor !== 1;

    let restrictedMiddleDigitWarning;
    if (!this.isItim() && hasRestrictedMiddleDigit) {
      restrictedMiddleDigitWarning = `The indicated digit must be a multiple of ${readonlyFactor}.`;
    }

    const range = this.getSelectableAddressRangeForConfig(webConfig);

    // HACK: The itim_base_addr is hardcoded to always be disabled here.
    // This can be removed either when another mechanism for disabling address
    // knobs is created or when the addresses of all devices are configurable.
    const disabled =
      this.internalName === "itim_base_addr" ||
      this.isDisabledByContainer(webConfig);
    const isValid = this.isValid(webConfig);
    const overlaps = getMemoryMapOverlaps(webConfig).get(name) || [];

    let conflictingItem;
    if (isValid) {
      conflictingItem = null;
    } else {
      /* eslint-disable prefer-destructuring */
      conflictingItem = overlaps[0];
    }

    const isPerCore = this.isPerCore();
    const isMulticore = webConfig.number_of_cores > 1;

    return (
      <VStack gap="1.6rem" key={this.internalName}>
        {!this.isItim() && (
          <HexAddressNotes
            inclusiveRangeMax={range.end - 1}
            minVal={range.start}
          />
        )}

        {conflictingItem && <Warning conflict={conflictingItem} />}

        <LabeledAddress
          label="Base Address"
          restrictedMiddleDigitWarning={restrictedMiddleDigitWarning}
          disabled={disabled}
        >
          <Address
            displayBits={getAddressableBitsForConfig(webConfig)}
            alignmentBits={alignmentBits}
            disabled={disabled}
            value={base}
            onChange={(newValue) => this.handleChange!(newValue, webConfig)}
            shouldClamp={this.shouldClamp()}
          />
        </LabeledAddress>

        {(!isPerCore || !isMulticore) && (
          <LabeledAddress label="Top Address" disabled={disabled}>
            <Address
              displayBits={getAddressableBitsForConfig(webConfig)}
              readonly
              disabled={disabled}
              value={top}
              onChange={(newValue) => this.handleChange!(newValue, webConfig)}
              shouldClamp={this.shouldClamp()}
            />
          </LabeledAddress>
        )}

        {isMulticore && isPerCore && (
          <PerCoreMemoryMessage
            internalName={this.internalName}
            sizeKnob={this.sizeKnob}
            webConfig={webConfig}
          />
        )}
      </VStack>
    );
  }

  getDefaultState() {
    return { [this.internalName]: this.knobSpec.defaultValue };
  }

  getDisplayValue(webConfig: WebConfigType) {
    return getFormattedHex(webConfig[this.internalName] as number);
  }

  getBlockDisplayValue(webConfig: WebConfigType) {
    return getFormattedHex(webConfig[this.internalName] as number);
  }

  // Itims are set to a fixed value, so we shouldn't show range messages
  isItim() {
    return this.internalName === "itim_base_addr";
  }

  getReviewValue(webConfig: WebConfigType) {
    if (this.isDisabledByContainer(webConfig)) {
      return "None";
    }
    const displayVal = this.getDisplayValue(webConfig);

    // 38-bit addresses are too big to display on one line on the review page
    // Grab the second '_' and add a space so the line breaks cleanly after the '_'
    let n = 0;
    const formattedVal = displayVal.replace(/_/g, (match) => {
      n += 1;
      if (n === 2) {
        return "_ ";
      }
      return match;
    });

    return formattedVal;
  }

  /* eslint-disable-next-line class-methods-use-this */
  getDefaultReviewValue() {
    if (!super.isDefaultActive()) {
      return "None";
    }
    return getFormattedHex(this.defaultValue as number);
  }

  validateKnobSpec() {
    ValidatorUtil.baseKnobValidation(this);
  }

  timName() {
    const idx = this.internalName.indexOf("base_addr");
    return this.internalName.substr(0, idx - 1);
  }

  isValid(webConfig: WebConfigType) {
    const name = this.timName();
    const overlaps = getMemoryMapOverlaps(webConfig).get(name) || [];
    return overlaps.length === 0;
  }
}

class TimBaseAddressKnob extends BaseTopAddressKnob {
  // eslint-disable-next-line class-methods-use-this
  shouldClamp(): boolean {
    return true;
  }

  /** The range of addresses allowed to be selected for a given configuration.
   * Used by Address knob and timBaseAddress knob.
   * `end` is exclusive.
   */
  getSelectableAddressRangeForConfig = (webConfig: any) => {
    const addressableBits = getAddressableBitsForConfig(webConfig);
    return {
      start: 0x2000_0000,
      end: 2 ** addressableBits,
    };
  };
}

class AdrRemaprBaseAddressKnob extends BaseTopAddressKnob {
  // eslint-disable-next-line class-methods-use-this
  shouldClamp(): boolean {
    return false;
  }

  /** The range of addresses allowed to be selected for a given configuration.
   * This is used by adrRemaprBaseAddress knob, which can have a start address
   * of 0x0000_0000 unlike the other two address knobs.
   * `end` is exclusive.
   */
  // eslint-disable-next-line import/no-unused-modules
  getSelectableAddressRangeForConfig = (webConfig: any) => {
    const addressableBits = getAddressableBitsForConfig(webConfig);
    return {
      start: 0x0000_0000,
      end: 2 ** addressableBits,
    };
  };
}

// Subcomponents
//
// Don't want to convert all of KnobStyles to TypeScript right now, so create a
// copy of BoldKnobName with a type assertion.
const PrivateBoldKnobName = (BoldKnobName as unknown) as React.ComponentClass<{
  disabled: boolean;
  children: React.ReactNode;
}>;

type LabeledAddressProps = {
  label: string;
  children: React.ReactNode;
  restrictedMiddleDigitWarning?: string;
  disabled: boolean;
};
const LabeledAddress = ({
  label,
  restrictedMiddleDigitWarning,
  disabled,
  children,
}: LabeledAddressProps) => (
  <LabeledAddressContainer>
    <PrivateBoldKnobName disabled={disabled}>{label}</PrivateBoldKnobName>
    <LabeledAddressContents>{children}</LabeledAddressContents>
    {restrictedMiddleDigitWarning && (
      <SupplementalText>{restrictedMiddleDigitWarning}</SupplementalText>
    )}
  </LabeledAddressContainer>
);

type WarningProps = { conflict: string };
const Warning = ({ conflict }: WarningProps) => {
  // Replaces underscores with empty spaces
  const conflictDisplayName = conflict.replace(/_/g, " ").toUpperCase();
  return (
    <ErrorMessage>
      Address range conflicts with {conflictDisplayName}.
    </ErrorMessage>
  );
};

// eslint-disable-next-line import/no-unused-modules
export { TimBaseAddressKnob, AdrRemaprBaseAddressKnob };
