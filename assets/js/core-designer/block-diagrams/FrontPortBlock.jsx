import React from "react";

import PortBlock from "./PortBlock";
import { LeftArrow } from "./BlockStyles";

class FrontPortBlock extends PortBlock {
  constructor(props) {
    super(props);
    this.internalName = "front_port";
    this.displayName = "Front Port";
    this.arrow = <LeftArrow />;
  }
}

export default FrontPortBlock;
