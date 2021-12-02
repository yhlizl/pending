import React from "react";

import PortBlock from "./PortBlock";
import { RightArrow } from "./BlockStyles";

class PeripheralPortBlock extends PortBlock {
  constructor(props) {
    super(props);
    this.internalName = "peripheral_port";
    this.displayName = "Peripheral Port";
    this.arrow = <RightArrow />;
  }
}

export default PeripheralPortBlock;
