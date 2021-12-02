import React from "react";
import PropTypes from "prop-types";

import OffCoreBlock from "./OffCoreBlock";
import { DotSeparatedRow, PluralizedValue } from "./Shared";

class DebugBlock extends OffCoreBlock {
  constructor(props) {
    super(props);
    this.displayName = "Debug Module";
  }

  getContent() {
    const breakpoints = this.getInternalValue("debug_breakpoints");
    const debugInterface = this.getDisplayValue("debug_interface");
    const hasSba = this.getDisplayValue("has_sba");
    const extTriggers = `${this.getDisplayValue(
      "external_triggers"
    )} Ext Triggers`;
    const debugSnoop = this.getDisplayValue("has_debug_snoop");

    return (
      <>
        <DotSeparatedRow entries={[debugInterface, hasSba]} />
        <PluralizedValue
          value={breakpoints}
          singular="HW Breakpoint"
          plural="HW Breakpoints"
        />
        <DotSeparatedRow entries={[extTriggers, debugSnoop]} />
      </>
    );
  }

  isEnabled() {
    return this.props.webConfig.debug_hardware;
  }
}

DebugBlock.propTypes = {
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
};

export default DebugBlock;
