import React from "react";

import PortBlock from "./PortBlock";
import { RightArrow } from "./BlockStyles";

class MemoryPortBlock extends PortBlock {
  constructor(props) {
    super(props);
    this.internalName = "memory_port";
    this.displayName = "Memory Port";
    this.arrow = <RightArrow />;
  }
}

export default MemoryPortBlock;
