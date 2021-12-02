import React from "react";
import PropTypes from "prop-types";

import OffCoreBlock from "./OffCoreBlock";
import { PluralizedValue } from "./Shared";

class ClicBlock extends OffCoreBlock {
  constructor(props) {
    super(props);
    this.displayName = "CLIC";
  }

  getContent() {
    return (
      <div>
        <PluralizedValue
          value={this.getDisplayValue("clic_urgency_bits")}
          singular="Configuration Bit"
          plural="Configuration Bits"
        />
        <PluralizedValue
          value={this.getInternalValue("clic_interrupt_count")}
          singular="Interrupt"
          plural="Interrupts"
        />
      </div>
    );
  }

  isEnabled() {
    return this.getInternalValue("has_clic");
  }
}

ClicBlock.propTypes = {
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
};

export default ClicBlock;
