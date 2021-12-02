import e2KnobSpecs from "../../../json/choices/e2.json";
import e3KnobSpecs from "../../../json/choices/e3.json";
import e6KnobSpecs from "../../../json/choices/e6.json";
import e7KnobSpecs from "../../../json/choices/e7.json";
import s2KnobSpecs from "../../../json/choices/s2.json";
import s5KnobSpecs from "../../../json/choices/s5.json";
import s7KnobSpecs from "../../../json/choices/s7.json";
import u5KnobSpecs from "../../../json/choices/u5.json";
import u7KnobSpecs from "../../../json/choices/u7.json";
import adrRemaprSizeChoices from "../../../json/choices/common/adrRemaprSizeChoices.json";
import adrRemaprs from "../../../json/choices/common/adrRemaprs.json";
import frontPortPassthrough from "../../../json/choices/common/frontPortPassthrough.json";
import nMMIORegisters from "../../../json/choices/common/nMMIORegisters.json";
import RadioKnob from "./RadioKnob";
import RadioSliderKnob from "./RadioSliderKnob";
import SizeSliderKnob from "./SizeSliderKnob";
import BooleanKnob from "./BooleanKnob";
import MinMaxSliderKnob from "./MinMaxSliderKnob";
import { NumberKnob } from "./NumberKnob";
import { TextKnob } from "./TextKnob";
import AddressKnob from "./AddressKnob";
// timBaseAddressKnob is now moved to BaseTopAddressKnob.tsx
import {
  TimBaseAddressKnob,
  AdrRemaprBaseAddressKnob,
} from "./BaseTopAddressKnob";
import SeparatorKnob from "./SeparatorKnob";

const setKnobDefault = (knob, value) => {
  knob.defaultValue = value;
};

class KnobUtility {
  static seriesToKnobSpecs(ipSeries) {
    // process all knobspecs (from assets/json/choices/*.json files),
    // "choices": {"include" : ["adrRemaprSizeChoices.k1", "adrRemaprSizeChoices.k2"]}
    // where adrRemaprSizeChoices is json file name in the common folder
    // and k1 (ex: 4B), k2 (ex: 8Bto4G) are arrays which will be combined and
    // inplace replaced.
    const AllSeriesKnobSpecs = {
      E2: e2KnobSpecs,
      E3: e3KnobSpecs,
      E6: e6KnobSpecs,
      E7: e7KnobSpecs,
      S2: s2KnobSpecs,
      S5: s5KnobSpecs,
      S7: s7KnobSpecs,
      U5: u5KnobSpecs,
      U7: u7KnobSpecs,
    };
    const seriesKnobSpecs = AllSeriesKnobSpecs[ipSeries.toUpperCase()];
    const choices = { adrRemaprSizeChoices };
    const adrRemapr = { adrRemaprs };
    const frontPortPassthroughConfiguration = { frontPortPassthrough };
    const nMMIOs = { nMMIORegisters };

    // map the file name to the object
    // key: file name used by "include". value: the object generated from its content
    const jsonMap = new Map([
      ["adrRemaprs", adrRemapr],
      ["frontPortPassthrough", frontPortPassthroughConfiguration],
      ["nMMIORegisters", nMMIOs],
    ]);

    // iterate thru all elements in the array for given series look for first level includes
    seriesKnobSpecs.forEach((knobSpec, index) => {
      // knobSpec is one object representing a knob
      // object replacement example to include two objects:
      // {"include": "adrRemaprs.basic_32"},{"include": "second_include.onemore"},
      // above json will open adrEemaprs.json and get basic_32 array and replace this
      // with all the objects of the array seperated by commas then repeat for second include
      if ("include" in knobSpec && typeof knobSpec.include === "string") {
        let newObjArray = [];
        const json_nm = knobSpec.include.split(".")[0];
        const json_key = knobSpec.include.split(".")[1];

        const json_file = jsonMap.get(json_nm);
        newObjArray = newObjArray.concat(json_file[json_nm][json_key]);

        seriesKnobSpecs.splice(index, 1, ...newObjArray);
        // replace this object with contents of newObjArray: {} --> {},{},{}...
      }
    });

    // iterate thru all elements in the array for given series look for
    // second level includes such as choices
    // {"include": ["adrRemaprSizeChoices.4B", "adrRemaprSizeChoices.8Bto4G"]}
    seriesKnobSpecs.forEach((knobSpec) => {
      if (
        "choices" in knobSpec &&
        typeof knobSpec.choices === "object" &&
        "include" in knobSpec.choices
      ) {
        // choices is an array, but in this case its an object, which will be replaced by an array
        // {"include": ["x.y", "x2.y2", ...]} --> [{},{},{}...]
        let newch = [];
        knobSpec.choices.include.forEach((incl) => {
          const json_nm = incl.split(".")[0];
          const json_key = incl.split(".")[1];
          newch = [...newch, ...choices[json_nm][json_key]];
        });
        knobSpec.choices = JSON.parse(JSON.stringify(newch));
      }
    });
    return seriesKnobSpecs;
  }

  static hydrateKnobs(ipSeries) {
    const knobSpecs = KnobUtility.seriesToKnobSpecs(ipSeries);
    const hydrated = knobSpecs.map((knobSpec) => {
      knobSpec.ipSeries = ipSeries;
      switch (knobSpec.type) {
        case "boolean":
          return new BooleanKnob(knobSpec);
        case "radioNumber":
          return new RadioKnob(knobSpec);
        case "radioSlider":
          return new RadioSliderKnob(knobSpec);
        case "radio":
          return new RadioKnob(knobSpec);
        case "minMaxSlider":
          return new MinMaxSliderKnob(knobSpec);
        case "number":
          return new NumberKnob(knobSpec);
        case "address":
          return new AddressKnob(knobSpec);
        case "sizeSlider":
          return new SizeSliderKnob(knobSpec);
        case "timBaseAddress":
          return new TimBaseAddressKnob(knobSpec);
        case "adrRemaprBaseAddress":
          return new AdrRemaprBaseAddressKnob(knobSpec);
        case "text":
          return new TextKnob(knobSpec);
        case "separator":
          return new SeparatorKnob(knobSpec);
        default:
          throw new Error(`Unknown knob type "${knobSpec.type}"`);
      }
    });
    KnobUtility.validateKnobSpecs(hydrated);
    const pointered = KnobUtility.setPointers(hydrated);
    pointered.forEach((knob) => knob.validateKnobSpec());
    return pointered;
  }

  static validateKnobSpecs(hydrated) {
    const internalNames = hydrated.map((knob) => knob.internalName);
    const validInternalNames = internalNames.filter((name) => name);
    if (validInternalNames.length !== internalNames.length) {
      throw new Error("Knob with invalid internal name");
    }
    const validInternalNameSet = new Set(validInternalNames);
    if (validInternalNames.length !== validInternalNameSet.size) {
      throw new Error("Knobs with repeated internal name");
    }
  }

  static setPointers(hydrated) {
    const knobMap = new Map();
    hydrated.forEach((knob) => knobMap.set(knob.internalName, knob));
    hydrated.forEach((knob) => {
      if (!knob.containedById) {
        return;
      }

      const container = knobMap.get(knob.containedById);
      knob.containedBy = container;
      knob.tabName = container.tabName;
      knob.sectionName = container.sectionName;
      container.contains.push(knob);
    });
    hydrated.forEach((sizeKnob) => {
      if (!sizeKnob.baseKnobId) {
        return;
      }
      const baseKnob = knobMap.get(sizeKnob.baseKnobId);
      if (!baseKnob || baseKnob.sizeKnobId !== sizeKnob.internalName) {
        throw new Error(
          "Bad spec: base and size knobs not paired: " +
            `${sizeKnob.baseKnobId} and ` +
            `${sizeKnob.internalName}`
        );
      }
      baseKnob.sizeKnob = sizeKnob;
      sizeKnob.baseKnob = baseKnob;
    });
    return hydrated;
  }

  static getDefaults(knobs) {
    const defaults = {};
    knobs.forEach((knob) => Object.assign(defaults, knob.getDefaultState()));
    return defaults;
  }

  static setDefaults(ipSeries, defaultValues) {
    const knobSpecs = KnobUtility.seriesToKnobSpecs(ipSeries);
    knobSpecs.forEach((knob) => {
      setKnobDefault(knob, defaultValues[knob.internalName]);
    });
  }
}

export default KnobUtility;
