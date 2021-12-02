import styled from "styled-components";
import bigInt from "big-integer";
import React, { useEffect } from "react";

import { PALETTE, COLOR } from "utils/StyleConstants";
import { FONT_FAMILY } from "components/StyledComponents";

// ========================================================================== //
//                                                                            //
//                             Styled Components                              //
//                                                                            //
// ========================================================================== //

const AddressContainer = styled.div`
  font-family: ${FONT_FAMILY.Mono};
`;

type DigitBoxWrapperProps = {
  spacer: boolean;
};
const DigitBoxWrapper = styled.span<DigitBoxWrapperProps>`
  position: relative;

  &:not(:last-child) {
    margin-right: ${(props) => (props.spacer ? "0.8rem" : "0.2rem")};
  }
`;

const IndicatedDigitTriangle = styled.div`
  border-color: transparent transparent ${PALETTE.Gray77} transparent;
  border-style: solid;
  border-width: 0 4px 6px 4px;
  bottom: -5px;
  height: 0;
  left: 6px;
  position: absolute;
  width: 0;
  transform: rotate(360deg);
`;

type SingleDigitBoxProps = {
  valueRestricted: boolean;
  valid: boolean;
};
const SingleDigitBox = styled.input<SingleDigitBoxProps>`
  text-align: center;
  display: inline;
  font-size: 14px;
  width: 1.8rem;
  padding: 2px;
  color: ${(props) => {
    if (props.disabled) return PALETTE.Gray88;
    if (props.readOnly) return PALETTE.Gray49;
    return PALETTE.Gray33;
  }};
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) =>
    props.valueRestricted ? PALETTE.Gray88 : PALETTE.GrayCC};
  background-color: ${(props) => {
    if (props.readOnly) {
      return "transparent";
    }
    return PALETTE.White;
  }};
  outline: ${(props) => (props.valid ? "" : `${COLOR.FormError} auto 5px`)};
`;

type ZeroPrefixProps = { disabled: boolean };
const ZeroPrefix = styled.span<ZeroPrefixProps>`
  color: ${(props) => (props.disabled ? PALETTE.Gray88 : PALETTE.Gray49)};
  margin-right: 0.4rem;
  opacity: 0.8;
`;

// ========================================================================== //
//                                                                            //
//                                    Helpers                                 //
//                                                                            //
// ========================================================================== //

type OnChangeType = (newValue: number) => void;

// For auto-focusing inputs upon selection
const autoFocus = (event: React.MouseEvent<HTMLInputElement>): void => {
  event.currentTarget.focus();
  event.currentTarget.setSelectionRange(0, 99999);
};

/** The number of hex digits needed to contain a given number of bits.
 *
 * Partial hex digits are rounded up, since the whole hex digit is needed to
 * contain the bits.
 */
const getNumberOfHexDigits = (numBits: number): number =>
  Math.ceil(numBits / 4);

/** Given alignment bits, return the number of hex digits that are readonly.
 *
 * This amounts to counting the number of f's in the hex representation.
 * Partially readonly hex digits do not count as readonly.
 *
 * Examples:
 *   numReadonlyDigits(8) // Mask: 0x000000ff
 *     => 2
 *   numReadonlyDigits(20) // Mask: 0x000fffff
 *     => 5
 *   numReadonlyDigits(15) // Mask: 0x00007fff
 *     => 3
 */
const numReadonlyDigits = (alignmentBits: number): number =>
  Math.floor(alignmentBits / 4);

/** Return the readonly factor of a partially editable hexadecimal digit.
 *
 * We display addresses in the form of hexadecimal digits (nibbles), but the
 * actual granularity of alignment is at the level of binary digits (bits). When
 * the alignment is not a multiple of 16, then the hexadecimal digit at the
 * boundary between readonly and fully editable digits is not allowed to assume
 * certain values, since those values would violate the requirement that an
 * address must be a multiple of the alignment (natural alignment).
 *
 * In particular, you can only enter a hex digit which is a multiple of the
 * number returned by this function.

 * In the case of a alignment that is a multiple of 16, this function returns
 * 1, since all numbers are trivially a multiple of 1.
 *
 * Note that this function accepts the alignment expressed in the form of
 * bits, not the whole number, since this is a more convenient way to restrict
 * non-power-of-two alignment. alignment = 2^alignmentBits.

 * Examples:
 *   partialReadonlyFactor(15) // Mask: 0x00007fff
 *     => 8
 *   partialReadonlyFactor(22) // Mask: 0x003fffff
 *     => 4
 *   partialReadonlyFactor(21) // Mask: 0x001fffff
 *     => 2
 *   partialReadonlyFactor(8)  // Mask: 0x000000ff
 *     => 1
 */
const partialReadonlyFactor = (alignmentBits: number): number =>
  2 ** (alignmentBits % 4);

/*
  Given a value, returns the integer value of the ith least significant nibble.

  Examples:
    nibbleAt(0xcafebabe, 0)
      => 0xe
    nibbleAt(0xcafebabe, 7)
      => 0xc
    nibbleAt(0xcafebabe, 6)
      => 0xa
*/
function nibbleAt(value: number, i: number): number {
  let intermediate = value;
  for (let j = 0; j < i; j += 1) {
    const rem = intermediate % 16;
    intermediate = (intermediate - rem) / 0x10;
  }
  return intermediate % 16;
}

/*
  Given a value, returns a list of length physicalAddressBits/4
  which gives the integer value of each nibble expressed in a big-endian way.

  Example:
    toNibbles(0xcafebabe, 32)
      => [0xc, 0xa, 0xf, 0xe, 0xb, 0xa, 0xb, 0xe]
*/
function toNibbles(value: number, numDigits: number): number[] {
  const nibbles = [];
  for (let i = numDigits - 1; i >= 0; i -= 1) {
    nibbles.push(nibbleAt(value, i));
  }
  return nibbles;
}

/*
  Given a list of numberic values bewteen 0x0 and 0xf (inclusive),
  returns the number made up from those values as its hex digits.

  Example:
    fromNibbles([0xc, 0xa, 0xf, 0xe, 0xb, 0xa, 0xb, 0xe])
      => 0xcafebabe
*/
function fromNibbles(nibbleList: number[]): number {
  let result = 0;
  for (let i = 0; i < nibbleList.length; i += 1) {
    result *= 0x10;
    result += nibbleList[i];
  }
  return result;
}

/** This method figures out which digits are read-only or limited and converts
 * the inputted value into a 'clamped' value, which follows these restrictions.
 *
 * JavaScript can only perform bitwise math on signed 32-bit integers
 * For any bigger numbers (ie 32-bit), we have to convert it to a bigInt.
 * bigInt is not yet fully supported, so we use a polyfill for it.
 */
function getClampedValue(
  value: number,
  alignmentBits: number,
  displayBits: number,
  shouldClamp = true
  // shouldClamp=true for AddressKnob and timBaseAddressKnob, false for adrRemapsBaseAddressKnob
): number {
  const maxVal = bigInt(2 ** displayBits - 1);
  const maskVal = bigInt(2 ** alignmentBits - 1);
  const currentVal = bigInt(value);

  const newMask = maskVal.xor(maxVal);
  const clampedVal = currentVal.and(newMask);
  const clampedValConverted = clampedVal.toJSNumber();

  // HACK: This prevents clamping to an address of 0, which is not allowed today
  // because Core Designer does not have knowledge of entities at low addresses.
  // If we receive a value of 0, bump it up to the next valid value.
  // Do this clamping only when shouldClamp===true, which is the case for
  // timBaseAddress knob and false for other knobs such as adrRemaper knob
  if (shouldClamp && clampedValConverted === 0) {
    return 2 ** alignmentBits;
  }
  return clampedValConverted;
}

// ========================================================================== //
//                                                                            //
//                              Main Component                                //
//                                                                            //
// ========================================================================== //

type AddressProps = {
  /** Number of bits that used for displaying addresses. */
  displayBits: number;

  /** Alignment of selectable addresses.
   *
   * Describes the minimum alignment allowed, expressed in bits.
   * 2 ^ alignmentBits is the actual alignment, and the address value must be
   * divisible by that alignment factor.
   *
   * Should not be set for read-only widgets (e.g. top addresses)
   */
  alignmentBits?: number;

  /** Value of the address represented by this widget. */
  value: number;

  /** Callback for when value is changed. */
  onChange?: OnChangeType;

  /** Whether the widget is readonly and cannot be interacted with. */
  readonly?: boolean;

  /** Whether the widget is totally disabled.
   *
   * Different from readonly in that readonly may be used for an Address widget
   * that is linked to a different non-disabled widget, such as the top address
   * paired with a base address.
   */
  disabled?: boolean;

  /** To reuse the Address widget,introduced this shouldClamp variable
   * which will determine whether to clamp base to 0x2000_0000 or not.
   * Made it optional to make work with timBaseAddressKnob.tsx
   */
  shouldClamp?: boolean;
};

const Address = ({
  displayBits,
  alignmentBits,
  value,
  onChange,
  readonly = false,
  disabled = false,
  shouldClamp = true,
}: AddressProps) => {
  return (
    <AddressContainer>
      <ZeroPrefix disabled={disabled}>0x</ZeroPrefix>
      <InputBoxes
        displayBits={displayBits}
        alignmentBits={alignmentBits}
        value={value}
        onChange={onChange}
        readonly={readonly}
        disabled={disabled}
        shouldClamp={shouldClamp}
      />
    </AddressContainer>
  );
};

// ========================================================================== //
//                                                                            //
//                              Sub-components                                //
//                                                                            //
// ========================================================================== //

type InputBoxesProps = {
  displayBits: number;
  alignmentBits?: number;
  value: number;
  onChange?: OnChangeType;
  disabled: boolean;
  readonly: boolean;
  shouldClamp: boolean;
};
const InputBoxes = ({
  displayBits,
  alignmentBits,
  value,
  onChange,
  disabled,
  readonly,
  shouldClamp,
}: InputBoxesProps) => {
  const numDigits = getNumberOfHexDigits(displayBits);
  const numRoDigits = alignmentBits ? numReadonlyDigits(alignmentBits) : 0;
  const partialRoFactor = partialReadonlyFactor(alignmentBits ?? displayBits);

  const boxes = [];

  useEffect(() => {
    if (readonly || disabled || !alignmentBits || !onChange) return;

    const clampedValue = getClampedValue(
      value,
      alignmentBits,
      displayBits,
      shouldClamp
    );
    if (value !== clampedValue) {
      onChange(clampedValue);
    }
  });

  for (let index = 0; index < numDigits; index += 1) {
    const nibbleIndex = numDigits - index - 1;
    const digitIsReadonly = readonly || disabled || numRoDigits > nibbleIndex;
    const displayValue = nibbleAt(value, nibbleIndex)
      .toString(16)
      .toUpperCase();
    const valueRestricted =
      partialRoFactor !== 1 && nibbleIndex === numRoDigits && !digitIsReadonly;
    const hasSpacer = nibbleIndex % 4 === 0;

    let onKeyPress;

    if (onChange !== undefined) {
      onKeyPress = (evt: React.KeyboardEvent) => {
        evt.preventDefault();
        const newNibbleValue = parseInt(evt.key, 16);
        // ignore case where a hex digit wasn't entered
        if (!(newNibbleValue >= 0 && newNibbleValue < 16)) {
          return;
        }
        if (digitIsReadonly) {
          return;
        }
        if (valueRestricted && newNibbleValue % partialRoFactor !== 0) {
          return;
        }

        const nibblesList = toNibbles(value, numDigits);
        nibblesList[index] = newNibbleValue;
        const newValue = fromNibbles(nibblesList);
        onChange(newValue);
      };
    } else {
      onKeyPress = (evt: React.KeyboardEvent) => evt.preventDefault();
    }

    const entryBox = (
      <DigitBoxWrapper spacer={hasSpacer} key={`entryBox${index}`}>
        <SingleDigitBox
          readOnly={digitIsReadonly}
          disabled={disabled}
          value={displayValue}
          onChange={() => null}
          onKeyPress={onKeyPress}
          valid
          valueRestricted={valueRestricted}
          onMouseUp={autoFocus}
        />
        {valueRestricted && <IndicatedDigitTriangle />}
      </DigitBoxWrapper>
    );
    boxes.push(entryBox);
  }
  return <>{boxes}</>;
};

export default Address;
export { partialReadonlyFactor };
// eslint-disable-next-line import/no-unused-modules
export { AddressProps };
