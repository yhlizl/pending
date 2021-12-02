import React from "react";
import PropTypes from "prop-types";

import DiagramBlock from "./DiagramBlock";
import { PortContainer, PortTitle, PortContent } from "./BlockStyles";
import { ValueText } from "./Shared";

class PortBlock extends DiagramBlock {
  getQualifiedInternalName() {
    if (this.props.portNum) {
      return `${this.internalName}_${this.props.portNum}`;
    }
    return this.internalName;
  }

  getHasPortKey() {
    return `has_${this.getQualifiedInternalName()}`;
  }

  getHasProtocolKey() {
    return `${this.getQualifiedInternalName()}_protocol`;
  }

  getBusWidthKey() {
    return `${this.getQualifiedInternalName()}_bus_width`;
  }

  getDisplayName() {
    if (this.props.portNum) {
      return `${this.displayName} ${this.props.portNum}`;
    }
    return this.displayName;
  }

  render() {
    const { top, left, webConfig } = this.props;
    const enabled = webConfig[this.getHasPortKey()];
    const busWidth = this.getDisplayValue(this.getBusWidthKey());
    const busProtocol = this.getDisplayValue(this.getHasProtocolKey());

    return (
      <PortContainer enabled={enabled} top={top} left={left}>
        <PortTitle>{this.getDisplayName()}</PortTitle>
        <PortContent>
          {!enabled || <ValueText>{busWidth}</ValueText>}
          {enabled ? <ValueText>{busProtocol}</ValueText> : "None"}
        </PortContent>
        {!enabled || this.arrow}
      </PortContainer>
    );
  }
}

PortBlock.propTypes = {
  portNum: PropTypes.string,
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
};

export default PortBlock;
