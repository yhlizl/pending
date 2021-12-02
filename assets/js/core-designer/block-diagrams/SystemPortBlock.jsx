import React from "react";

import PortBlock from "./PortBlock";
import { RightArrow } from "./BlockStyles";

class SystemPortBlock extends PortBlock {
  constructor(props) {
    super(props);
    this.internalName = "system_port";
    this.displayName = "System Port";
    this.arrow = <RightArrow />;
  }
}

export default SystemPortBlock;
