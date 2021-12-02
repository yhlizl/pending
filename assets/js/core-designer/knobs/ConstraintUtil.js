import { getWebConfig } from "redux/store";

// ========================================================================== //
//                                                                            //
//                              Helper Functions                              //
//                                                                            //
// ========================================================================== //

const updateConfigParam = (stateUpdate, key, value) => {
  const webConfig = getWebConfig();
  const paramsToUpdate = stateUpdate;
  if (key in webConfig) {
    paramsToUpdate[key] = value;
  }
  return paramsToUpdate;
};

// ========================================================================== //
//                                                                            //
//                            Enabling / Disabling                            //
//                                                                            //
// ========================================================================== //

export const isBoolKnobEnabled = (knobName, ipSeries) => {
  const webConfig = getWebConfig();

  switch (knobName) {
    case "clock_gating":
      return webConfig.has_clock_gate_extraction === false;

    case "floating_point_half_precision_present":
      return false;

    case "has_core_local_port":
      return false;

    case "has_clint":
      return false;

    case "has_clock_gate_extraction":
      return webConfig.clock_gating === true;

    case "has_dls":
      return webConfig.has_dtim === false;

    case "has_ecc":
      if (["E7", "S7", "U7"].includes(ipSeries)) {
        if (webConfig.has_dls && webConfig.dls_pipeline_depth === 0) {
          return false;
        }
      }
      return true;

    case "has_group_and_wrap":
      return (
        webConfig.has_clock_gate_extraction === true ||
        webConfig.has_sram_extraction === true
      );

    case "has_hca":
      return false;

    case "has_mct":
      return false;

    case "has_memory_port":
      return false;

    case "has_l2_cache":
      return webConfig.has_memory_port === true;

    case "has_ppd":
      return false;

    case "has_scie":
      if (["E2", "S2"].includes(ipSeries)) {
        return webConfig.core_interfaces === 2;
      }
      return true;

    case "has_tim_0":
      return webConfig.has_tim_1 === false;

    case "has_tim_1":
      return webConfig.has_tim_0 === true;

    case "has_uicache":
      return webConfig.core_interfaces === 2;

    case "multiplication_extension":
      return webConfig.floating_point === "No FP";

    case "tim_0_amo":
      return webConfig.atomics_extension === true;

    case "tim_1_amo":
      return webConfig.atomics_extension === true;

    case "has_beu":
      return ["E2", "E3", "E7", "S2", "S3", "S5", "S7", "U5", "U7"].includes(
        webConfig.ip_series
      );

    default:
      return true;
  }
};

export const isNumberKnobEnabled = (knobName, webConfig) => {
  switch (knobName) {
    case "sram_user_defined_inputs":
    case "sram_user_defined_outputs":
      return (
        !webConfig.has_sram_extraction && !webConfig.has_clock_gate_extraction
      );
    default:
      return true;
  }
};

// ========================================================================== //
//                                                                            //
//                        Auto Selecting / Deselecting                        //
//                                                                            //
// ========================================================================== //

const onKnobChanged = ({ knobName, newValue, ipSeries, stateUpdate }) => {
  let paramsToUpdate = stateUpdate;
  const webConfig = getWebConfig();

  switch (knobName) {
    case "atomics_extension":
      if (["E2", "S2"].includes(ipSeries)) {
        if (newValue === false) {
          paramsToUpdate = updateConfigParam(
            paramsToUpdate,
            "tim_0_amo",
            false
          );
          paramsToUpdate = updateConfigParam(
            paramsToUpdate,
            "tim_1_amo",
            false
          );
        }
      }
      break;

    case "core_interfaces":
      if (["E2", "S2"].includes(ipSeries)) {
        if (newValue === 1) {
          paramsToUpdate = updateConfigParam(
            paramsToUpdate,
            "has_uicache",
            false
          );
          paramsToUpdate = updateConfigParam(
            paramsToUpdate,
            "floating_point",
            "No FP"
          );
          paramsToUpdate = updateConfigParam(paramsToUpdate, "has_scie", false);
        }
      }
      break;

    case "dls_banks": {
      const hasMultipleBanks = newValue > 1;
      if (hasMultipleBanks && webConfig.dls_pipeline_depth !== 3) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "dls_pipeline_depth",
          3
        );
      }
      break;
    }

    case "has_aes_mac":
      if (newValue === true) {
        paramsToUpdate = updateConfigParam(paramsToUpdate, "has_aes", true);
      }
      break;

    case "has_beu":
      if (["E3", "E7", "S5", "S7", "U5", "U7"].includes(ipSeries)) {
        if (newValue === false) {
          paramsToUpdate = updateConfigParam(paramsToUpdate, "has_ecc", false);
        }
      }
      break;

    case "has_clic":
      if (["E2", "S2"].includes(ipSeries)) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "has_clint",
          !newValue
        );
        if (!newValue)
          paramsToUpdate = updateConfigParam(
            paramsToUpdate,
            "has_beu",
            newValue
          );
      }
      break;

    case "has_plic":
      if (["E3", "E7", "S5", "S7", "U5", "U7"].includes(ipSeries)) {
        if (!newValue)
          paramsToUpdate = updateConfigParam(
            paramsToUpdate,
            "has_beu",
            newValue
          );
      }
      break;

    case "has_clock_gate_extraction":
      if (!webConfig.has_sram_extraction) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "has_group_and_wrap",
          false
        );
      }
      break;

    case "has_dtim":
      if (["E3", "E7", "S5", "S7", "U5", "U7"].includes(ipSeries)) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "has_memory_port",
          !newValue
        );
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "has_l2_cache",
          !newValue
        );
      }
      if (["E7", "S7", "U7"].includes(ipSeries)) {
        if (newValue === true) {
          paramsToUpdate = updateConfigParam(paramsToUpdate, "has_dls", false);
        }
      }
      break;

    case "has_ecc":
      if (["E3", "E7", "S5", "S7", "U5", "U7"].includes(ipSeries)) {
        if (newValue === true) {
          paramsToUpdate = updateConfigParam(paramsToUpdate, "has_beu", true);
        }
      }
      if (["E7", "S7", "U7"].includes(ipSeries)) {
        if (newValue === true && webConfig.dls_pipeline_depth === 0) {
          // This intentionally covers the case where has_dls is false and
          // dls_pipeline_depth was set to 0 prior to setting has_dls to false.
          // In this case, the DLS pipeline still has a visible value of 0, even
          // though the entire hierarchical DLS knob is disabled.
          //
          // This if statement will handle the case where ECC is enabled and
          // force the DLS pipeline depth to 1. Normally a user is prevented
          // from enabling ECC if the DLS pipeline depth is 0. However, if the
          // entire DLS knob is disabled, then we instead want to coerce the DLS
          // pipeline depth to a valid value (e.g 1). The makes it so that if
          // the DLS is re-enabled, the DLS pipeline depth will have a valid
          // value with respect to ECC.
          paramsToUpdate = updateConfigParam(
            paramsToUpdate,
            "dls_pipeline_depth",
            1
          );
        }
      }
      break;

    case "has_pmp":
      paramsToUpdate = updateConfigParam(
        paramsToUpdate,
        "has_user_mode",
        newValue
      );
      break;

    case "has_rv32e":
      if (newValue === true) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "floating_point",
          "No FP"
        );
      }
      break;

    case "has_sram_extraction":
      if (!webConfig.has_clock_gate_extraction) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "has_group_and_wrap",
          false
        );
      }
      break;

    case "has_trace_encoder":
      if (webConfig.number_of_cores > 1) {
        paramsToUpdate = updateConfigParam(paramsToUpdate, "has_mct", newValue);
      }
      break;

    case "has_user_mode":
      paramsToUpdate = updateConfigParam(paramsToUpdate, "has_pmp", newValue);
      break;

    case "icache_config_mode":
      if (["E7", "S7", "U7"].includes(ipSeries)) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "icache_minimal_mode",
          !newValue
        );
      }
      break;

    case "icache_minimal_mode":
      if (["E7", "S7", "U7"].includes(ipSeries)) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "icache_config_mode",
          !newValue
        );
      }
      break;

    case "multiplication_extension":
      if (newValue === false) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "floating_point",
          "No FP"
        );
      }
      break;

    case "number_of_cores": {
      const isMultiCore = newValue > 1;
      if (isMultiCore && webConfig.has_trace_encoder) {
        paramsToUpdate = updateConfigParam(paramsToUpdate, "has_mct", true);
      } else {
        paramsToUpdate = updateConfigParam(paramsToUpdate, "has_mct", false);
      }
      break;
    }

    case "tim_0_banks": {
      const hasMultipleBanks = newValue > 1;
      if (hasMultipleBanks && webConfig.tim_0_pipeline_depth !== 3) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "tim_0_pipeline_depth",
          3
        );
      }
      break;
    }

    case "tim_1_banks": {
      const hasMultipleBanks = newValue > 1;
      if (hasMultipleBanks && webConfig.tim_1_pipeline_depth !== 3) {
        paramsToUpdate = updateConfigParam(
          paramsToUpdate,
          "tim_1_pipeline_depth",
          3
        );
      }
      break;
    }

    default:
      break;
  }

  return paramsToUpdate;
};

export const boolChangesOtherKnobs = (
  stateUpdate,
  knobName,
  checked,
  ipSeries
) => {
  let paramsToUpdate = stateUpdate;

  paramsToUpdate = onKnobChanged({
    knobName,
    newValue: checked,
    ipSeries,
    stateUpdate,
  });

  return paramsToUpdate;
};

export const minMaxSliderChangesOtherKnobs = (
  choice,
  stateUpdate,
  knobName,
  ipSeries
) => {
  let paramsToUpdate = stateUpdate;

  paramsToUpdate = onKnobChanged({
    knobName,
    newValue: choice.internalValue,
    ipSeries,
    stateUpdate,
  });

  return paramsToUpdate;
};

export const radioKnobChangesOtherKnobs = (
  choice,
  stateUpdate,
  knobName,
  ipSeries
) => {
  let paramsToUpdate = stateUpdate;

  paramsToUpdate = onKnobChanged({
    knobName,
    newValue: choice.internalValue,
    ipSeries,
    stateUpdate,
  });

  return paramsToUpdate;
};

export const getDisabledRadioChoices = ({ knobName, ipSeries }) => {
  const webConfig = getWebConfig();

  switch (knobName) {
    case "dls_pipeline_depth":
      if (webConfig.dls_banks !== 1) {
        return [0, 1];
      }
      if (webConfig.has_ecc) {
        return [0];
      }
      return [];

    case "floating_point":
      if (["E2", "S2"].includes(ipSeries)) {
        if (
          webConfig.core_interfaces === 1 ||
          webConfig.has_rv32e === true ||
          webConfig.multiplication_extension === false
        ) {
          return ["FP (F)", "FP (F & D)"];
        }
      } else if (
        ["E3", "E6", "E7", "S5", "S7", "U5", "U7"].includes(ipSeries)
      ) {
        if (
          webConfig.multiplication_extension === false ||
          webConfig.has_rv32e === true
        ) {
          return ["FP (F)", "FP (F & D)"];
        }
      } else {
        throw new Error(`Unhandled series: ${ipSeries}`);
      }
      return [];

    case "has_rv32e":
      if (["FP (F)", "FP (F & D)"].includes(webConfig.floating_point)) {
        return [true];
      }
      return [];

    case "tim_0_pipeline_depth":
      if (webConfig.tim_0_banks !== 1) {
        return [0, 1];
      }
      return [];

    case "tim_1_pipeline_depth":
      if (webConfig.tim_1_banks !== 1) {
        return [0, 1];
      }
      return [];

    default:
      return [];
  }
};

export const isEntireKnobDisabled = (knobName) => {
  const webConfig = getWebConfig();

  switch (knobName) {
    case "front_port_axi_id_bit_width":
      return webConfig.front_port_protocol !== "AXI4";

    case "memory_port_axi_id_bit_width":
      return webConfig.memory_port_protocol !== "AXI4";

    case "system_port_axi_id_bit_width":
      return webConfig.system_port_protocol !== "AXI4";

    case "system_port_0_axi_id_bit_width":
      return webConfig.system_port_0_protocol !== "AXI4";

    case "system_port_1_axi_id_bit_width":
      return webConfig.system_port_1_protocol !== "AXI4";

    case "trace_buffer_size":
      return !webConfig.has_trace_encoder_sram_sink;

    default:
      return false;
  }
};

/** Whether a knob should be rendered, based on other knobs' values.
 */
export const shouldKnobBeRendered = (knobName) => {
  const webConfig = getWebConfig();

  switch (knobName) {
    case "front_port_axi_id_bit_width":
      return webConfig.front_port_protocol === "AXI4";

    case "memory_port_axi_id_bit_width":
      return webConfig.memory_port_protocol === "AXI4";

    case "system_port_axi_id_bit_width":
      return webConfig.system_port_protocol === "AXI4";

    case "system_port_0_axi_id_bit_width":
      return webConfig.system_port_0_protocol === "AXI4";

    case "system_port_1_axi_id_bit_width":
      return webConfig.system_port_1_protocol === "AXI4";

    default:
      return true;
  }
};

/** The number of address bits for a given configuration. */
export const getAddressableBitsForConfig = (webConfig) => {
  switch (webConfig.ip_series) {
    case "E2":
    case "E3":
    case "E6":
    case "E7":
      return 32;

    case "S2":
    case "S5":
    case "S7":
      return 40;

    case "U5":
    case "U7":
      if (webConfig.virtual_addressing_modes === "Sv39_Sv48") {
        return 47;
      }
      return 38;

    default:
      throw new Error(`Invalid IP series: ${webConfig.ip_series}`);
  }
};

/** The range of addresses allowed to be selected for a given configuration.
 * Used by Address knob and timBaseAddress knob.
 * `end` is exclusive.
 * Only AddressKnob calls this global function.
 * TimBaseAddressKnob does not use this function anymore. It has its own class
 * member with same functionality.
 */
export const getSelectableAddressRangeForConfig = (webConfig) => {
  const addressableBits = getAddressableBitsForConfig(webConfig);
  return {
    start: 0x2000_0000,
    end: 2 ** addressableBits,
  };
};
