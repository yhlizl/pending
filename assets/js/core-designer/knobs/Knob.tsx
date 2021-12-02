/* eslint-disable  @typescript-eslint/no-unused-vars */
import { getUserCapabilities } from "utils/GlobalData";
import { WebConfigType, WebConfigValueType } from "utils/Types";
import { getFormattedHex, getHumanReadableSize } from "./AddressUtils";

// Types

type Restriction = {
  type: "max";
  value: number;
  capabilities: string[];
};

/** Knob specification data format.
 *
 * This corresponds exactly to the JSON files in assets/json/choices. Note that
 * this inteface is currently incomplete, and more properties should be added to
 * match those found in the JSON files.
 */
interface KnobSpec {
  containedById?: string;
  defaultValue: WebConfigValueType;
  displayName: string;
  internalName: string;
  min?: number;
  max?: number;
  restriction: Restriction;
  reviewName: string;
  type: string;
}

function knobIsRestricted(knobSpec: KnobSpec) {
  if (
    knobSpec.restriction &&
    knobSpec.restriction.capabilities.filter(
      (cap) => !getUserCapabilities()[cap]
    ).length > 0
  ) {
    return true;
  }
  return false;
}

// Workaround the fact that TypeScript is unable to infer that Knob's
// constructor is correct, since it doesn't understand that
// Object.assign(this, knobSpec) will set all the KnobSpec properties on this.
//
// https://github.com/microsoft/TypeScript/issues/9448#issuecomment-255300864
//
// ESLint rule disabled because despite what the rule message says,
//   interface Knob extends KnobSpec {}
// is _not_ equivalent to
//   type Knob = KnobSpec;
//
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Knob extends KnobSpec {}

abstract class Knob implements Knob {
  contains: Knob[];

  containedBy?: Knob;

  knobSpec: KnobSpec;

  constructor(knobSpec: KnobSpec) {
    Object.assign(this, knobSpec);

    this.contains = [];
    this.knobSpec = knobSpec;
  }

  /* eslint-disable-next-line class-methods-use-this, no-unused-vars */
  overlapsWith(webConfig: WebConfigType): JSX.Element[] {
    return [];
  }

  // Create handler for changes in the knobs value
  abstract createStateUpdateCallbacks(
    callback: (config: Partial<WebConfigType>) => void
  ): void;

  // Returns contribution to the webConfig configuration webConfig
  abstract getDefaultState(): Partial<WebConfigType>;

  // Should be overidden by any knob that can contain other knobs to indicate
  // that child knobs should be disabled.
  /* eslint-disable-next-line class-methods-use-this */
  shouldContainedKnobsBeDisabled(webConfig: WebConfigType): boolean {
    throw new Error("Must override shouldContainedKnobsBeDisabled()");
  }

  // Should be called by any knob to check if its containing knob is in a state
  // that causes all lower-level knobs to be disabled.
  isDisabledByContainer(webConfig: WebConfigType) {
    if (
      this.containedBy &&
      this.containedBy.shouldContainedKnobsBeDisabled(webConfig)
    ) {
      return true;
    }
    return false;
  }

  // Is this knob active by default?
  isDefaultActive() {
    if (this.containedBy && !this.containedBy.isDefaultActive()) {
      return false;
    }
    return true;
  }

  // Returns the JSX representing the Knob
  abstract getFormElements(webConfig: WebConfigType): JSX.Element;

  // Returns the value displayed in the diagram
  abstract getDisplayValue(webConfig: WebConfigType): string;

  // Returns the value displayed in the diagram
  abstract getBlockDisplayValue(webConfig: WebConfigType): string;

  // Returns the value displayed in the design summary table
  abstract getReviewValue(webConfig: WebConfigType): string;

  /* eslint-disable-next-line class-methods-use-this */
  isValid(webConfig: WebConfigType): boolean {
    return true;
  }

  // Returns the default value displayed in the design summary table
  abstract getDefaultReviewValue(): string;

  isRestricted() {
    return knobIsRestricted(this.knobSpec);
  }

  showRestrictionMessage(webConfig: WebConfigType): boolean {
    // TODO: Remove icache hardcoding?
    if (this.internalName === "icache_size" && webConfig.icache_minimal_mode) {
      return false;
    }

    if (this.containedById && webConfig[this.containedById] === false) {
      return false;
    }

    if (!this.isRestricted()) {
      return false;
    }

    const currentValue = webConfig[this.internalName];
    const restrictionValue = this.getRestrictionValue();

    if (this.restriction.type === "max") {
      const valueIsAboveMax = currentValue > restrictionValue;
      return valueIsAboveMax;
    }
    if (this.restriction.type === "default") {
      const valueMatchesDefault = currentValue === restrictionValue;
      return !valueMatchesDefault;
    }
    return false;
  }

  getRestrictionDisplayValue(): string | number {
    if (this.type === "address") {
      return getFormattedHex(this.getRestrictionValue() as number);
    }
    if (
      this.type === "sizeSlider" ||
      this.type === "radioNumber" ||
      this.type === "radioSlider"
    ) {
      return getHumanReadableSize(this.getRestrictionValue() as number);
    }

    const value = this.getRestrictionValue();
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    throw new Error(`Cannot display value ${value}`);
  }

  getRestrictionValue() {
    return this.restriction.type === "max"
      ? this.restriction.value
      : this.defaultValue;
  }

  abstract validateKnobSpec(): void;

  // Is this knob repeated per-core, or is there only one per design?
  isPerCore(): boolean {
    const perCoreNames = ["dtim_base_addr", "itim_base_addr", "dls_base_addr"];
    return perCoreNames.indexOf(this.internalName) > -1;
  }
}

export default Knob;
