import React from "react";
import PropTypes from "prop-types";

import OffCoreBlock from "./OffCoreBlock";

import { PluralizedValue, ValueText } from "./Shared";

class PlicBlock extends OffCoreBlock {
  constructor(props) {
    super(props);
    this.displayName = "PLIC";
  }

  getContent() {
    const plicLevelValue = this.getInternalValue("plic_interrupt_priorities");
    const plicInterruptValue = this.getDisplayValue("plic_interrupt_count");
    const plicInterruptDisplay = `${plicInterruptValue} Global Int.`;

    return (
      <div>
        <div>
          <PluralizedValue
            value={plicLevelValue}
            singular="Priority Level"
            plural="Priority Levels"
          />
        </div>
        <div>
          <ValueText>{plicInterruptDisplay}</ValueText>
        </div>
      </div>
    );
  }

  isEnabled() {
    return this.props.webConfig.has_plic;
  }
}

PlicBlock.propTypes = {
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
};

export default PlicBlock;
