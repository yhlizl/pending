function hasAtLeastOneOutboundPort(webConfig) {
  const portSelectionKnobs = [
    "has_system_port",
    "has_system_port_0",
    "has_system_port_1",
    "has_peripheral_port",
    "has_memory_port",
  ];

  return portSelectionKnobs.some((portName) => webConfig[portName]);
}

const CheckInterruptValue = (webConfig) => {
  const ipSeries = webConfig.ip_series;
  if (ipSeries === "E2" || ipSeries === "S2") {
    const { has_beu } = webConfig;
    const { clic_interrupt_count } = webConfig;
    if (has_beu === true && clic_interrupt_count > 111) {
      return true;
    }
  }
  return false;
};

const dCacheIsTooSmall = (webConfig) => {
  if (["U5", "U7"].includes(webConfig.ip_series)) {
    if (!webConfig.has_l2_cache) {
      return webConfig.dtim_size / webConfig.dcache_assoc > 4;
    }
  }
  return false;
};

const memoryPortSizeIsTooSmall = (webConfig) => {
  const hasL2Cache = webConfig.has_l2_cache;

  if (hasL2Cache) {
    const l2CacheSize = webConfig.l2_cache_size;
    const memPortSize = webConfig.memory_port_size;
    return memPortSize < l2CacheSize;
  }
  return false;
};

const hasAtLeastOneTraceSink = (webConfig) =>
  !webConfig.has_trace_encoder ||
  webConfig.has_trace_encoder_sram_sink ||
  webConfig.has_trace_encoder_atb_sink ||
  webConfig.has_trace_encoder_pib_sink ||
  webConfig.has_trace_encoder_sba_sink;

class WebConfigValidator {
  constructor(webConfig) {
    this.webConfig = webConfig;
    this.validated = false;
    this.errorMessage = null;
  }

  isValid() {
    if (!this.validated) {
      if (!hasAtLeastOneOutboundPort(this.webConfig)) {
        this.errorMessage = "You need at least one outbound port.";
      }

      if (dCacheIsTooSmall(this.webConfig)) {
        this.errorMessage =
          "Data Cache size error. Please refer to the Data Cache configuration for error details.";
      }

      if (CheckInterruptValue(this.webConfig)) {
        this.errorMessage =
          "Bus Error Unit+CLIC:This configuration has a limitation of 111 interrupts or less due to the BEU occupying the mcause=128 interrupt slot.";
      }

      if (memoryPortSizeIsTooSmall(this.webConfig)) {
        this.errorMessage =
          "Memory Port Size must be greater than or equal to L2 Cache Size.";
      }

      if (!hasAtLeastOneTraceSink(this.webConfig)) {
        this.errorMessage = "Trace Encoder requires at least one sink.";
      }

      this.validated = true;
    }

    return this.errorMessage === null;
  }

  getErrorMessage() {
    return this.errorMessage;
  }
}

export default WebConfigValidator;
