import React from "react";
import styled from "styled-components";
import { ErrorIcon } from "components/Icons";
import { VStack } from "components/Spacing";
import {
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
} from "components/StyledComponents";
import { PALETTE } from "utils/StyleConstants";
import { ErrorMessage } from "components/MessageComponents";
import { KnobRestrictionMessage } from "core-designer/tabpanels/Shared/Components";
import { getMemoryMapOverlaps } from "core-designer/MemoryMapHelpers";
import { WebConfigType } from "utils/Types";

import {
  getAlignmentBitsFromSize,
  getFormattedHex,
  getTopAddress,
} from "./AddressUtils";
import {
  getAddressableBitsForConfig,
  getSelectableAddressRangeForConfig,
} from "./ConstraintUtil";
import { SupplementalText, BoldKnobName, HexAddressNotes } from "./KnobStyles";
import Knob from "./Knob";
import ValidatorUtil from "./ValidatorUtil";
import Address, { partialReadonlyFactor } from "./widgets/Address";
import { PerCoreMemoryMessage } from "./PerCoreMemoryMessage";

// Don't want to convert all of KnobStyles to TypeScript right now, so create a
// copy of BoldKnobName with a type assertion.
const PrivateBoldKnobName = (BoldKnobName as unknown) as React.ComponentClass<{
  disabled: boolean;
  children: React.ReactNode;
}>;

// ========================================================================== //
//                                                                            //
//                            Styled Components                               //
//                                                                            //
// ========================================================================== //

// Note: This is not an actual <label> element because it wraps all the address
// digits, where each digit is represented by a distinct <input> element. It is
// illegal to associate a <label> with multiple <input>s, and this apparently
// causes an issue in Safari.
const HexLabel = styled.div`
  display: grid;
  font-size: ${FONT_SIZE.Medium};
  grid-row-gap: 0.8rem;
  line-height: ${LINE_HEIGHT.Medium};
  width: 100%;
`;

const HexNumberKnobContainer = styled(VStack).attrs({ gap: "0.8rem" })``;

type TopAddressStyleProps = { disabled: boolean };
const TopAddressStyle = styled.div<TopAddressStyleProps>`
  border: 1px ${PALETTE.GrayD4} solid;
  color: ${(props) => (props.disabled ? PALETTE.Gray88 : PALETTE.Gray42)};
  font-family: ${FONT_FAMILY.Mono};
  opacity: 0.8;
  padding: 0.3rem 0.7rem;
`;

const AddressWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// ========================================================================== //
//                                                                            //
//                              Main Knob Class                               //
//                                                                            //
// ========================================================================== //

class AddressKnob extends Knob {
  // TODO: Remove ! type assertion after refactoring Knob class. When the
  // strictPropertyInitialization option is enabled in TypeScript, it wants to
  // strictly enforce that all non-optional properties are initialized in the
  // constructor of a class. In our case, the KnobUtility.hydrateKnobs()
  // function sets this property. This is indeed very obtuse and difficult for
  // even humans to understand, so hopefully this can be refactored so that the
  // type assertion is unnecessary.
  sizeKnob!: Knob;

  handleChange?: (newValue: number) => void;

  createStateUpdateCallbacks(
    callback: (config: Partial<WebConfigType>) => void
  ) {
    this.handleChange = (newValue) => {
      callback({ [this.internalName]: newValue });
    };
  }

  getFormElements(webConfig: WebConfigType) {
    const disabled = this.isDisabledByContainer(webConfig);
    const numIsValid = this.numberKnobIsValid(webConfig);
    const topIsValid = this.topIsValid(webConfig);
    const noOverlap = this.noOverlap(webConfig);
    const knobFails: JSX.Element[] = [];

    const base = webConfig[this.internalName] as number;
    const size = webConfig[this.sizeKnob.internalName] as number;
    const top = getTopAddress(base, size);

    const alignmentBits = getAlignmentBitsFromSize(size * 1024);
    const readonlyFactor = partialReadonlyFactor(alignmentBits);

    const hasRestrictedMiddleDigit = readonlyFactor !== 1;

    let restrictedMiddleDigitWarning = null;
    if (hasRestrictedMiddleDigit) {
      restrictedMiddleDigitWarning = `The indicated digit must be a multiple of ${readonlyFactor}.`;
    }

    const range = getSelectableAddressRangeForConfig(webConfig);

    if (this.shouldDisplayOwnOverlapMessage()) {
      const overlaps = this.overlapsWith(webConfig);
      if (overlaps) {
        overlaps.forEach((el) => knobFails.push(el));
      }
    }

    // If this is a rocket or bullet core, and this is the DTIM base address,
    //    and DTIM isn't enabled, hide this.
    if (this.isHiddenDTIMAddress(webConfig)) {
      return <div />;
    }

    const isPerCore = this.isPerCore();
    const isMulticore = webConfig.number_of_cores > 1;

    return (
      <VStack gap="1.2rem" key={this.internalName}>
        <HexAddressNotes
          inclusiveRangeMax={range.end - 1}
          minVal={range.start}
        />
        <HexNumberKnobContainer>
          <HexLabel>
            <PrivateBoldKnobName disabled={disabled}>
              Base Address
              {(!noOverlap || !numIsValid) && (
                <>
                  {" "}
                  <ErrorIcon isInline />
                </>
              )}
            </PrivateBoldKnobName>
            <AddressWrapper>
              <Address
                displayBits={getAddressableBitsForConfig(webConfig)}
                alignmentBits={alignmentBits}
                disabled={disabled}
                value={base}
                onChange={this.handleChange}
              />
            </AddressWrapper>
            <SupplementalText>{restrictedMiddleDigitWarning}</SupplementalText>
          </HexLabel>
        </HexNumberKnobContainer>
        {isMulticore && isPerCore && (
          <PerCoreMemoryMessage
            internalName={this.internalName}
            sizeKnob={this.sizeKnob}
            webConfig={webConfig}
          />
        )}
        {(!isPerCore || !isMulticore) && (
          <TopAddress topIsValid={topIsValid} disabled={disabled} top={top} />
        )}
        {/* FIXME: This warning message is not rendered in the same places as
        the overlap mesages. Ideally, they should probably be grouped together. */}
        {!numIsValid && <Warning message="Base Address is not in range" />}
        {!topIsValid && <Warning message="Top Address is not in range" />}
        {this.showRestrictionMessage(webConfig) && (
          <KnobRestrictionMessage
            restrictionName={this.displayName}
            restrictionValue={this.getRestrictionDisplayValue()}
          />
        )}
        {knobFails}
      </VStack>
    );
  }

  // If this address knob isn't contained by another knob, display any overlap
  // messages here.
  shouldDisplayOwnOverlapMessage() {
    return !this.containedBy;
  }

  isHiddenDTIMAddress(webConfig: WebConfigType) {
    const isRocketOrBullet =
      ["3", "5", "7"].indexOf((webConfig.ip_series as string).substr(-1)) > -1;
    return (
      this.internalName === "dtim_base_addr" &&
      isRocketOrBullet &&
      !webConfig.has_dtim
    );
  }

  getDisplayValue(webConfig: WebConfigType) {
    return getFormattedHex(webConfig[this.internalName] as number);
  }

  getBlockDisplayValue(webConfig: WebConfigType) {
    return getFormattedHex(webConfig[this.internalName] as number);
  }

  getDefaultReviewValue() {
    if (!super.isDefaultActive()) {
      return "None";
    }
    return getFormattedHex(this.defaultValue as number);
  }

  overlapsWith(webConfig: WebConfigType) {
    const name = this.getPortName();
    const overlaps: string[] = getMemoryMapOverlaps(webConfig).get(name) || [];

    // Replaces underscores with empty spaces
    const getDisplayName = (knobName: string) =>
      knobName.replace(/_/g, " ").toUpperCase();

    return overlaps.map((knobName) => (
      <Warning
        key={`${knobName}-overlap-warning`}
        message={`Address range conflicts with ${getDisplayName(knobName)}.`}
      />
    ));
  }

  isValid(webConfig: WebConfigType) {
    return (
      this.numberKnobIsValid(webConfig) &&
      this.noOverlap(webConfig) &&
      this.topIsValid(webConfig)
    );
  }

  noOverlap(webConfig: WebConfigType) {
    const name = this.getPortName();
    const overlaps = getMemoryMapOverlaps(webConfig).get(name) || [];
    return overlaps.length === 0;
  }

  numberKnobIsValid(webConfig: WebConfigType) {
    const currVal = webConfig[this.internalName];
    if (Number.isNaN(currVal)) {
      return false;
    }

    const { start, end } = getSelectableAddressRangeForConfig(webConfig);
    return start <= currVal && currVal < end;
  }

  topIsValid(webConfig: WebConfigType) {
    const base = webConfig[this.internalName];
    const size = webConfig[this.sizeKnob.internalName];
    const top = getTopAddress(base as number, size as number);

    const { start, end } = getSelectableAddressRangeForConfig(webConfig);
    return start <= top && top < end;
  }

  validateKnobSpec() {
    ValidatorUtil.baseKnobValidation(this);
    ValidatorUtil.assertHasProperty(this, "defaultValue");
  }

  // FIXME_GLOBAL: port overlap detection
  getPortName() {
    return this.internalName.match(/(.*)_base_addr/)![1];
  }

  getDefaultState() {
    return { [this.internalName]: this.defaultValue };
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
}

// ========================================================================== //
//                                                                            //
//                                Sub-components                              //
//                                                                            //
// ========================================================================== //

type TopAddressProps = {
  topIsValid: boolean;
  top: number;
  disabled: boolean;
};
const TopAddress = ({ topIsValid, top, disabled }: TopAddressProps) => (
  <HexNumberKnobContainer>
    <HexLabel>
      <PrivateBoldKnobName disabled={disabled}>
        Top Address
        {!topIsValid && (
          <>
            {" "}
            <ErrorIcon isInline />
          </>
        )}
      </PrivateBoldKnobName>
      <AddressWrapper>
        <TopAddressStyle disabled={disabled}>
          {getFormattedHex(top)}
        </TopAddressStyle>
      </AddressWrapper>
    </HexLabel>
  </HexNumberKnobContainer>
);

type WarningProps = { message: string };
const Warning = ({ message }: WarningProps) => (
  <ErrorMessage>{message}</ErrorMessage>
);

export default AddressKnob;
