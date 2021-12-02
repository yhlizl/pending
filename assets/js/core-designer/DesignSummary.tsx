import React from "react";
import styled from "styled-components";

import Knob from "core-designer/knobs/Knob";
import { LINE_HEIGHT } from "components/StyledComponents";
import { shouldKnobBeRendered } from "core-designer/knobs/ConstraintUtil";
import * as Colors from "utils/Colors";
import { SeriesName, WebConfigType } from "utils/Types";
import { UnreachableCaseError } from "utils/TypeUtilities";
import { configuratorTabs } from "./Constants";

// Styles

const TableContainer = styled.table`
  width: 100%;
  max-width: 488px;
  color: ${Colors.TextDark};
  font-size: 1.2rem;
  line-height: ${LINE_HEIGHT.Giant};
  padding: 0.8rem 1rem;
  text-align: left;
`;

const HeaderCol = styled.col`
  width: 36%;
`;

const DataCol = styled.col`
  width: 32%;
`;

const HeaderCell = styled.th`
  vertical-align: top;
`;

// To create the effect where the divider line between the header cells does not
// reach all the way down to the main table, we create an inner box that has a
// margin between it and the actual <th> element. This is because margin styles
// have no effect on <th> elements.
const HeaderCellInnerBox = styled.div`
  margin-bottom: 1.2rem;
  padding: 0 0.8rem;
  text-align: left;
  vertical-align: top;

  ${HeaderCell}:nth-child(2) & {
    border-right: solid 1px ${Colors.Gray300};
  }

  @media print {
    margin: 0;
    padding: 0.3rem 0.5rem;
  }
`;

const HeaderTitle = styled.div<{ isBold?: boolean }>`
  font-size: 1.3rem;
  font-weight: ${(props) => (props.isBold ? 700 : 300)};
  line-height: ${LINE_HEIGHT.VeryLarge};
  word-break: break-word;
`;

const HeaderEyebrow = styled.div`
  color: ${Colors.Gray500};
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 0.2rem;
`;

const ReviewCell = styled.td`
  vertical-align: top;
  background-color: ${Colors.Gray100};
  border: 1px solid ${Colors.Gray300};
  padding: 0.8rem 1rem;

  @media print {
    padding: 0.3rem 0.5rem;
  }
`;

const ReviewModifiedCell = styled(ReviewCell)`
  background-color: ${Colors.Gray050};

  @media print {
    font-weight: 500;
  }
`;

const ReviewSectionCell = styled(ReviewCell)`
  font-weight: 500;
  text-transform: uppercase;
  background-color: ${Colors.Gray200};

  @media print {
    border-bottom: solid 2px ${Colors.Black};
    border-top: solid 2px ${Colors.Black};
  }
`;

const LabelCell = styled(ReviewCell)<{ isBold?: boolean }>`
  color: ${Colors.Gray600};

  ${(props) => props.isBold && "font-weight: 700;"}
`;

const RestrictionMessage = styled.div`
  margin-top: 0.2rem;
  font-style: italic;
  color: ${Colors.Gray600};
`;

type KnobMap = Map<string, Knob>;

type GetSummaryRowsProps = {
  showBitManipulation: boolean;
  showBulletBranchPrediction: boolean;
  showCLIC: boolean;
  showCLINT: boolean;
  showCoreInterfaces: boolean;
  showDCache: boolean;
  showDTIM: boolean;
  showDataLocalStore: boolean;
  showAdrRemapr: boolean;
  showNumberOfMMIOReg: boolean;
  showDebugSnoop: boolean;
  showFastIO: boolean;
  showFloatingPointHalfPrecision: boolean;
  showICache: boolean;
  showITIM: boolean;
  showL2Cache: boolean;
  showL2CachePrefetcher: boolean;
  showMemoryPort: boolean;
  showMultiCoreTrace: boolean;
  showMultipleSystemPorts: boolean;
  showMultiplicationPerformance: boolean;
  showNumberOfCores: boolean;
  showPLIC: boolean;
  showRV32E: boolean;
  showRocketBranchPrediction: boolean;
  showSeparateReset: boolean;
  showSupervisorMode: boolean;
  showTIMs: boolean;
  showUICache: boolean;
};

const getSummaryRowsPropsForSeries = (
  ipSeries: SeriesName
): GetSummaryRowsProps => {
  switch (ipSeries) {
    case "E2":
      return {
        showBitManipulation: true,
        showBulletBranchPrediction: false,
        showCLIC: true,
        showCLINT: true,
        showCoreInterfaces: true,
        showDCache: false,
        showDTIM: false,
        showDataLocalStore: false,
        showAdrRemapr: true,
        showNumberOfMMIOReg: false,
        showDebugSnoop: true,
        showFastIO: false,
        showFloatingPointHalfPrecision: true,
        showICache: false,
        showITIM: false,
        showL2Cache: false,
        showL2CachePrefetcher: false,
        showMemoryPort: false,
        showMultiCoreTrace: false,
        showMultipleSystemPorts: true,
        showMultiplicationPerformance: true,
        showNumberOfCores: false,
        showPLIC: false,
        showRV32E: true,
        showRocketBranchPrediction: false,
        showSeparateReset: true,
        showSupervisorMode: false,
        showTIMs: true,
        showUICache: true,
      };
    case "E3":
      return {
        showBitManipulation: false,
        showBulletBranchPrediction: false,
        showCLIC: false,
        showCLINT: false,
        showCoreInterfaces: false,
        showDCache: true,
        showDTIM: true,
        showDataLocalStore: false,
        showAdrRemapr: true,
        showNumberOfMMIOReg: false,
        showDebugSnoop: false,
        showFastIO: false,
        showFloatingPointHalfPrecision: false,
        showICache: true,
        showITIM: false,
        showL2Cache: true,
        showL2CachePrefetcher: false,
        showMemoryPort: true,
        showMultiCoreTrace: true,
        showMultipleSystemPorts: false,
        showMultiplicationPerformance: true,
        showNumberOfCores: true,
        showPLIC: true,
        showRV32E: true,
        showRocketBranchPrediction: true,
        showSeparateReset: false,
        showSupervisorMode: false,
        showTIMs: false,
        showUICache: false,
      };
    case "E6":
      return {
        showBitManipulation: true,
        showBulletBranchPrediction: true,
        showCLIC: false,
        showCLINT: false,
        showCoreInterfaces: false,
        showDCache: true,
        showDTIM: true,
        showAdrRemapr: true,
        showNumberOfMMIOReg: true,
        showDataLocalStore: true,
        showDebugSnoop: false,
        showFastIO: true,
        showFloatingPointHalfPrecision: true,
        showICache: true,
        showITIM: true,
        showL2Cache: true,
        showL2CachePrefetcher: true,
        showMemoryPort: true,
        showMultiCoreTrace: true,
        showMultipleSystemPorts: false,
        showMultiplicationPerformance: false,
        showNumberOfCores: true,
        showPLIC: true,
        showRV32E: true,
        showRocketBranchPrediction: false,
        showSeparateReset: false,
        showSupervisorMode: false,
        showTIMs: false,
        showUICache: false,
      };
    case "E7":
      return {
        showBitManipulation: true,
        showBulletBranchPrediction: true,
        showCLIC: false,
        showCLINT: false,
        showCoreInterfaces: false,
        showDCache: true,
        showDTIM: true,
        showAdrRemapr: true,
        showNumberOfMMIOReg: true,
        showDataLocalStore: true,
        showDebugSnoop: false,
        showFastIO: true,
        showFloatingPointHalfPrecision: true,
        showICache: true,
        showITIM: true,
        showL2Cache: true,
        showL2CachePrefetcher: true,
        showMemoryPort: true,
        showMultiCoreTrace: true,
        showMultipleSystemPorts: false,
        showMultiplicationPerformance: false,
        showNumberOfCores: true,
        showPLIC: true,
        showRV32E: true,
        showRocketBranchPrediction: false,
        showSeparateReset: false,
        showSupervisorMode: false,
        showTIMs: false,
        showUICache: false,
      };
    case "S2":
      return {
        showBitManipulation: true,
        showBulletBranchPrediction: false,
        showCLIC: true,
        showCLINT: true,
        showCoreInterfaces: true,
        showDCache: false,
        showDTIM: false,
        showDataLocalStore: false,
        showAdrRemapr: true,
        showNumberOfMMIOReg: false,
        showDebugSnoop: true,
        showFastIO: false,
        showFloatingPointHalfPrecision: true,
        showICache: false,
        showITIM: false,
        showL2Cache: false,
        showL2CachePrefetcher: false,
        showMemoryPort: false,
        showMultiCoreTrace: false,
        showMultipleSystemPorts: true,
        showMultiplicationPerformance: true,
        showNumberOfCores: false,
        showPLIC: false,
        showRV32E: false,
        showRocketBranchPrediction: false,
        showSeparateReset: true,
        showSupervisorMode: false,
        showTIMs: true,
        showUICache: true,
      };
    case "S5":
      return {
        showBitManipulation: false,
        showBulletBranchPrediction: false,
        showCLIC: false,
        showCLINT: false,
        showCoreInterfaces: false,
        showDCache: true,
        showDTIM: true,
        showDataLocalStore: false,
        showAdrRemapr: true,
        showNumberOfMMIOReg: false,
        showDebugSnoop: false,
        showFastIO: false,
        showFloatingPointHalfPrecision: false,
        showICache: true,
        showITIM: false,
        showL2Cache: true,
        showL2CachePrefetcher: false,
        showMemoryPort: true,
        showMultiCoreTrace: true,
        showMultipleSystemPorts: false,
        showMultiplicationPerformance: true,
        showNumberOfCores: true,
        showPLIC: true,
        showRV32E: false,
        showRocketBranchPrediction: true,
        showSeparateReset: false,
        showSupervisorMode: false,
        showTIMs: false,
        showUICache: false,
      };
    case "S7":
      return {
        showBitManipulation: true,
        showBulletBranchPrediction: true,
        showCLIC: false,
        showCLINT: false,
        showCoreInterfaces: false,
        showDCache: true,
        showDTIM: true,
        showDataLocalStore: true,
        showAdrRemapr: true,
        showNumberOfMMIOReg: true,
        showDebugSnoop: false,
        showFastIO: true,
        showFloatingPointHalfPrecision: true,
        showICache: true,
        showITIM: true,
        showL2Cache: true,
        showL2CachePrefetcher: true,
        showMemoryPort: true,
        showMultiCoreTrace: true,
        showMultipleSystemPorts: false,
        showMultiplicationPerformance: false,
        showNumberOfCores: true,
        showPLIC: true,
        showRV32E: false,
        showRocketBranchPrediction: false,
        showSeparateReset: false,
        showSupervisorMode: false,
        showTIMs: false,
        showUICache: false,
      };
    case "U5":
      return {
        showBitManipulation: false,
        showBulletBranchPrediction: false,
        showCLIC: false,
        showCLINT: false,
        showCoreInterfaces: false,
        showDCache: true,
        showDTIM: false,
        showDataLocalStore: false,
        showAdrRemapr: false,
        showNumberOfMMIOReg: false,
        showDebugSnoop: false,
        showFastIO: false,
        showFloatingPointHalfPrecision: false,
        showICache: true,
        showITIM: false,
        showL2Cache: true,
        showL2CachePrefetcher: false,
        showMemoryPort: true,
        showMultiCoreTrace: true,
        showMultipleSystemPorts: false,
        showMultiplicationPerformance: true,
        showNumberOfCores: true,
        showPLIC: true,
        showRV32E: false,
        showRocketBranchPrediction: true,
        showSeparateReset: false,
        showSupervisorMode: true,
        showTIMs: false,
        showUICache: false,
      };
    case "U7":
      return {
        showBitManipulation: true,
        showBulletBranchPrediction: true,
        showCLIC: false,
        showCLINT: false,
        showCoreInterfaces: false,
        showDCache: true,
        showDTIM: false,
        showDataLocalStore: true,
        showAdrRemapr: false,
        showNumberOfMMIOReg: true,
        showDebugSnoop: false,
        showFastIO: false,
        showFloatingPointHalfPrecision: true,
        showICache: true,
        showITIM: true,
        showL2Cache: true,
        showL2CachePrefetcher: true,
        showMemoryPort: true,
        showMultiCoreTrace: true,
        showMultipleSystemPorts: false,
        showMultiplicationPerformance: false,
        showNumberOfCores: true,
        showPLIC: true,
        showRV32E: false,
        showRocketBranchPrediction: false,
        showSeparateReset: false,
        showSupervisorMode: true,
        showTIMs: false,
        showUICache: false,
      };
    default:
      throw new UnreachableCaseError(ipSeries);
  }
};

// Main Component

type DesignSummaryProps = {
  webConfig: WebConfigType;
  knobs: Knob[];
  ipSeries: SeriesName;
  baseCoreIP: string;
};
class DesignSummary extends React.Component<
  DesignSummaryProps,
  Record<string, never>
> {
  knobMap: KnobMap;

  constructor(props: DesignSummaryProps) {
    super(props);
    this.knobMap = new Map();
    this.props.knobs.forEach((k) => this.knobMap.set(k.internalName, k));
  }

  getKnobRow = (knobInternalName: string, isSubhead?: boolean) => {
    if (!shouldKnobBeRendered(knobInternalName)) return null;

    const knob = this.knobMap.get(knobInternalName);

    if (!knob) {
      throw new Error(`Cannot find knob ${knobInternalName}`);
    }

    // TODO: Remove icache hardcoding
    let knobValue = knob.getReviewValue(this.props.webConfig);
    const defaultValue = knob.getDefaultReviewValue();

    if (
      knobInternalName === "icache_size" &&
      this.props.webConfig.icache_minimal_mode
    ) {
      knobValue = "None";
    }
    if (
      knobInternalName === "icache_assoc" &&
      this.props.webConfig.icache_minimal_mode
    ) {
      knobValue = "None";
    }
    if (
      knobInternalName === "trace_buffer_size" &&
      !this.props.webConfig.has_trace_encoder_sram_sink
    ) {
      knobValue = "None";
    }
    if (
      [
        "trace_encoder_pib_sink_width_bits",
        "has_trace_encoder_pib_sink_clock_input",
      ].includes(knobInternalName) &&
      !this.props.webConfig.has_trace_encoder_pib_sink
    ) {
      knobValue = "None";
    }

    const isRestricted = knob.showRestrictionMessage(this.props.webConfig);
    const isModified = knobValue !== defaultValue;

    let bodyCells: JSX.Element;
    if (isRestricted) {
      bodyCells = (
        <>
          <ReviewModifiedCell>
            <RestrictionCellContents
              value={knobValue}
              restrictionDisplayValue={knob.getRestrictionDisplayValue()}
            />
          </ReviewModifiedCell>
          <ReviewCell>{defaultValue}</ReviewCell>
        </>
      );
    } else if (isModified) {
      bodyCells = (
        <>
          <ReviewModifiedCell>{knobValue}</ReviewModifiedCell>
          <ReviewCell>{defaultValue}</ReviewCell>
        </>
      );
    } else {
      bodyCells = <ReviewCell colSpan={2}>{knobValue}</ReviewCell>;
    }

    return (
      <tr>
        <LabelCell isBold={isSubhead}>{knob.reviewName}</LabelCell>
        {bodyCells}
      </tr>
    );
  };

  getSummaryRows = ({
    showBitManipulation,
    showBulletBranchPrediction,
    showCLIC,
    showCLINT,
    showCoreInterfaces,
    showDCache,
    showDTIM,
    showDataLocalStore,
    showAdrRemapr,
    showNumberOfMMIOReg,
    showDebugSnoop,
    showFastIO,
    showFloatingPointHalfPrecision,
    showICache,
    showITIM,
    showL2Cache,
    showL2CachePrefetcher,
    showMemoryPort,
    showMultiCoreTrace,
    showMultipleSystemPorts,
    showMultiplicationPerformance,
    showNumberOfCores,
    showPLIC,
    showRV32E,
    showRocketBranchPrediction,
    showSeparateReset,
    showSupervisorMode,
    showTIMs,
    showUICache,
  }: GetSummaryRowsProps) => (
    <>
      <SectionHeader sectionName={configuratorTabs.modesAndISA} />
      {showNumberOfCores && this.getKnobRow("number_of_cores")}
      {this.getKnobRow("has_machine_mode")}
      {this.getKnobRow("has_user_mode")}
      {showSupervisorMode && (
        <>
          {this.getKnobRow("has_supervisor_mode")}
          {this.getKnobRow("virtual_addressing_modes")}
        </>
      )}
      {showCoreInterfaces && this.getKnobRow("core_interfaces")}
      {showRV32E && this.getKnobRow("has_rv32e")}
      {this.getKnobRow("multiplication_extension")}
      {showMultiplicationPerformance &&
        this.getKnobRow("multiplication_performance")}
      {this.getKnobRow("atomics_extension")}
      {showBitManipulation && this.getKnobRow("bit_manipulation_extension")}
      {this.getKnobRow("floating_point")}
      {showFloatingPointHalfPrecision &&
        this.getKnobRow("floating_point_half_precision_present")}
      {this.getKnobRow("has_scie")}
      <SectionHeader sectionName={configuratorTabs.onChipMemory} />
      {showTIMs && (
        <>
          {this.getKnobRow("has_tim_0", true)}
          {this.getKnobRow("tim_0_size")}
          {this.getKnobRow("tim_0_base_addr")}
          {this.getKnobRow("tim_0_amo")}
          {this.getKnobRow("tim_0_pipeline_depth")}
          {this.getKnobRow("tim_0_banks")}
          {this.getKnobRow("has_tim_1", true)}
          {this.getKnobRow("tim_1_size")}
          {this.getKnobRow("tim_1_base_addr")}
          {this.getKnobRow("tim_1_amo")}
          {this.getKnobRow("tim_1_pipeline_depth")}
          {this.getKnobRow("tim_1_banks")}
        </>
      )}
      {showUICache && (
        <>
          {this.getKnobRow("has_uicache", true)}
          {this.getKnobRow("uicache_size")}
          {this.getKnobRow("uicache_line_size")}
        </>
      )}
      {showICache && (
        <>
          {this.getKnobRow("icache_size")}
          {this.getKnobRow("icache_assoc")}
        </>
      )}
      {(showDCache || showDTIM) && (
        /* Note that dtim_size simultaneously describes the D-Cache size, even
         * for series which do not allow for a DTIM. */
        <>
          {this.getKnobRow("has_dtim", true)}
          {this.getKnobRow("dtim_size")}
          {showDTIM && this.getKnobRow("dtim_base_addr")}
          {showDCache && this.getKnobRow("dcache_assoc")}
        </>
      )}
      {showITIM && (
        <>
          {this.getKnobRow("has_itim", true)}
          {this.getKnobRow("itim_size")}
          {this.getKnobRow("itim_base_addr")}
        </>
      )}
      {showDataLocalStore && (
        <>
          {this.getKnobRow("has_dls", true)}
          {this.getKnobRow("dls_size")}
          {this.getKnobRow("dls_base_addr")}
          {this.getKnobRow("dls_pipeline_depth")}
          {this.getKnobRow("dls_banks")}
        </>
      )}
      {showAdrRemapr && (
        <>
          {this.getKnobRow("has_adr_remapr", true)}
          {this.getKnobRow("adr_remapr_entries")}
          {this.getKnobRow("adr_remapr_from_base_addr")}
          {this.getKnobRow("adr_remapr_from_size")}
          {this.getKnobRow("adr_remapr_to_base_addr")}
          {this.getKnobRow("adr_remapr_to_size")}
          {this.getKnobRow("adr_remapr_max_remapper_region_size")}
        </>
      )}
      {showL2Cache && (
        <>
          {this.getKnobRow("has_l2_cache", true)}
          {this.getKnobRow("l2_cache_size")}
          {this.getKnobRow("l2_cache_assoc")}
          {this.getKnobRow("l2_cache_banks")}
          {this.getKnobRow("l1_to_l2_bus_width_bits")}
        </>
      )}
      {showL2CachePrefetcher && (
        <>
          {this.getKnobRow("prefStreamsSize")}
          {this.getKnobRow("prefQueueSize")}
        </>
      )}
      {showFastIO && this.getKnobRow("has_fast_io")}
      {showNumberOfMMIOReg && this.getKnobRow("number_of_MMIO_reg")}
      {this.getKnobRow("has_beu")}
      {this.getKnobRow("has_ecc")}
      <SectionHeader sectionName={configuratorTabs.ports} />
      {this.getKnobRow("has_front_port", true)}
      {this.getKnobRow("enable_front_port_pass_through")}
      {this.getKnobRow("front_port_protocol")}
      {this.getKnobRow("front_port_bus_width")}
      {this.getKnobRow("front_port_axi_id_bit_width")}
      {showMultipleSystemPorts ? (
        <>
          {this.getKnobRow("has_system_port_0", true)}
          {this.getKnobRow("system_port_0_protocol")}
          {this.getKnobRow("system_port_0_bus_width")}
          {this.getKnobRow("system_port_0_axi_id_bit_width")}
          {this.getKnobRow("system_port_0_base_addr")}
          {this.getKnobRow("system_port_0_size")}
          {this.getKnobRow("has_system_port_1", true)}
          {this.getKnobRow("system_port_1_protocol")}
          {this.getKnobRow("system_port_1_bus_width")}
          {this.getKnobRow("system_port_1_axi_id_bit_width")}
          {this.getKnobRow("system_port_1_base_addr")}
          {this.getKnobRow("system_port_1_size")}
        </>
      ) : (
        <>
          {this.getKnobRow("has_system_port", true)}
          {this.getKnobRow("system_port_protocol")}
          {this.getKnobRow("system_port_bus_width")}
          {this.getKnobRow("system_port_axi_id_bit_width")}
          {this.getKnobRow("system_port_base_addr")}
          {this.getKnobRow("system_port_size")}
        </>
      )}
      {this.getKnobRow("has_peripheral_port", true)}
      {this.getKnobRow("peripheral_port_protocol")}
      {this.getKnobRow("peripheral_port_bus_width")}
      {this.getKnobRow("peripheral_port_base_addr")}
      {this.getKnobRow("peripheral_port_size")}
      {showMemoryPort && (
        <>
          {this.getKnobRow("has_memory_port", true)}
          {this.getKnobRow("memory_port_protocol")}
          {this.getKnobRow("memory_port_bus_width")}
          {this.getKnobRow("memory_port_axi_id_bit_width")}
          {this.getKnobRow("memory_port_base_addr")}
          {this.getKnobRow("memory_port_size")}
        </>
      )}
      <SectionHeader sectionName={configuratorTabs.security} />
      {this.getKnobRow("has_pmp", true)}
      {this.getKnobRow("pmp_count")}
      {this.getKnobRow("hasDisableDebug")}
      {this.getKnobRow("has_ppd")}
      {this.getKnobRow("has_hca", true)}
      {this.getKnobRow("has_aes")}
      {this.getKnobRow("has_aes_mac")}
      {this.getKnobRow("has_sha")}
      {this.getKnobRow("has_trng")}
      {this.getKnobRow("has_pka")}
      {this.getKnobRow("pka_op_max_width")}
      <SectionHeader sectionName={configuratorTabs.debug} />
      {this.getKnobRow("debug_hardware", true)}
      {this.getKnobRow("debug_interface")}
      {this.getKnobRow("debug_breakpoints")}
      {this.getKnobRow("external_triggers")}
      {this.getKnobRow("has_sba")}
      {showDebugSnoop && this.getKnobRow("has_debug_snoop")}
      {this.getKnobRow("instruction_trace")}
      {this.getKnobRow("performance_counters")}
      {this.getKnobRow("has_trace_encoder", true)}
      {showMultiCoreTrace && this.getKnobRow("has_mct")}
      {this.getKnobRow("has_trace_encoder_sram_sink")}
      {this.getKnobRow("has_trace_encoder_atb_sink")}
      {this.getKnobRow("has_trace_encoder_pib_sink")}
      {this.getKnobRow("trace_encoder_pib_sink_width_bits")}
      {this.getKnobRow("has_trace_encoder_pib_sink_clock_input")}
      {this.getKnobRow("has_trace_encoder_sba_sink")}
      {this.getKnobRow("trace_buffer_size")}
      {this.getKnobRow("has_trace_encoder_timestamp")}
      {this.getKnobRow("trace_timestamp_width")}
      {this.getKnobRow("trace_timestamp_source")}
      {this.getKnobRow("trace_encoder_inputs")}
      {this.getKnobRow("trace_encoder_outputs")}
      {this.getKnobRow("has_itc")}
      {this.getKnobRow("has_trace_encoder_pc_sampling")}
      {this.getKnobRow("trace_encoder_trace_format")}
      <SectionHeader sectionName={configuratorTabs.interrupts} />
      {showPLIC && (
        <>
          {this.getKnobRow("has_plic", true)}
          {this.getKnobRow("plic_interrupt_priorities")}
          {this.getKnobRow("plic_interrupt_count")}
        </>
      )}
      {showCLIC && (
        <>
          {this.getKnobRow("has_clic", true)}
          {this.getKnobRow("clic_urgency_bits")}
          {this.getKnobRow("clic_interrupt_count")}
        </>
      )}
      {showCLINT && this.getKnobRow("has_clint", true)}
      {this.getKnobRow("local_interrupt_count")}
      <SectionHeader sectionName={configuratorTabs.designForTest} />
      {this.getKnobRow("has_sram_extraction")}
      {this.getKnobRow("has_clock_gate_extraction")}
      {this.getKnobRow("has_group_and_wrap")}
      {this.getKnobRow("sram_user_defined_inputs")}
      {this.getKnobRow("sram_user_defined_outputs")}
      <SectionHeader sectionName={configuratorTabs.clocksAndReset} />
      {this.getKnobRow("clock_gating")}
      {showSeparateReset && this.getKnobRow("has_separate_reset")}
      {this.getKnobRow("reset_scheme")}
      {(showRocketBranchPrediction || showBulletBranchPrediction) && (
        <>
          <SectionHeader sectionName={configuratorTabs.branchPrediction} />
          {showRocketBranchPrediction && (
            <>
              {this.getKnobRow("btb_entries")}
              {this.getKnobRow("bht_entries")}
              {this.getKnobRow("ras_entries")}
            </>
          )}
          {showBulletBranchPrediction && <>{this.getKnobRow("bp_optim")}</>}
        </>
      )}
      <SectionHeader sectionName={configuratorTabs.rtlOptions} />
      {this.getKnobRow("customizePrefix")}
    </>
  );

  render() {
    const summaryRowsProps = getSummaryRowsPropsForSeries(this.props.ipSeries);
    return (
      <TableContainer>
        <colgroup>
          <HeaderCol />
          <DataCol />
          <DataCol />
        </colgroup>
        <thead>
          <tr>
            <HeaderCell />
            <HeaderCell>
              <HeaderCellInnerBox>
                <HeaderEyebrow>Core Design</HeaderEyebrow>
                <HeaderTitle isBold>
                  {this.props.webConfig.design_name}
                </HeaderTitle>
              </HeaderCellInnerBox>
            </HeaderCell>
            <HeaderCell>
              <HeaderCellInnerBox>
                <HeaderEyebrow>Standard Core</HeaderEyebrow>
                <HeaderTitle>{this.props.baseCoreIP}</HeaderTitle>
              </HeaderCellInnerBox>
            </HeaderCell>
          </tr>
        </thead>
        <tbody>{this.getSummaryRows(summaryRowsProps)}</tbody>
      </TableContainer>
    );
  }
}

// Subcomponents

type RestrictionCellContentsProps = {
  restrictionDisplayValue: string | number;
  value: string | number;
};
const RestrictionCellContents = ({
  value,
  restrictionDisplayValue,
}: RestrictionCellContentsProps) => (
  <>
    <div>{value}</div>
    <RestrictionMessage>
      <div>Evaluation RTL:</div>
      <div>{restrictionDisplayValue}</div>
    </RestrictionMessage>
  </>
);

type SectionHeaderProps = { sectionName: string };
const SectionHeader = ({ sectionName }: SectionHeaderProps) => (
  <tr>
    <ReviewSectionCell colSpan={3}>{sectionName}</ReviewSectionCell>
  </tr>
);

export default DesignSummary;
