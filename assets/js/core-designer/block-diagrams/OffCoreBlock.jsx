import React from "react";
import PropTypes from "prop-types";

import DiagramBlock from "./DiagramBlock";
import { OffCoreContainer, OffCoreTitle, OffCoreContent } from "./BlockStyles";

class OffCoreBlock extends DiagramBlock {
  render() {
    const { top, left, width } = this.props;
    const enabled = this.isEnabled();
    return (
      <OffCoreContainer enabled={enabled} top={top} left={left} width={width}>
        <OffCoreTitle enabled={enabled}>{this.displayName}</OffCoreTitle>
        <OffCoreContent enabled={enabled}>
          {enabled ? this.getContent() : "None"}
        </OffCoreContent>
      </OffCoreContainer>
    );
  }
}

OffCoreBlock.propTypes = {
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
};

export default OffCoreBlock;
