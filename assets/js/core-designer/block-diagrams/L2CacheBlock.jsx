import React from "react";
import PropTypes from "prop-types";

import OffCoreBlock from "./OffCoreBlock";
import { DotSeparatedRow, PluralizedValue } from "./Shared";
import { L2Container, L2Title, OffCoreContent } from "./BlockStyles";

class L2CacheBlock extends OffCoreBlock {
  render() {
    const { top, left } = this.props;
    const hasL2 = this.getInternalValue("has_l2_cache");
    const l2Size = this.getDisplayValue("l2_cache_size");
    const l2Ways = `${this.getDisplayValue("l2_cache_assoc")}-way`;
    const l2Banks = this.getInternalValue("l2_cache_banks");

    return (
      <L2Container width="11rem" enabled={hasL2} top={top} left={left}>
        <OffCoreContent enabled={hasL2}>
          <L2Title enabled={hasL2}>L2 Cache</L2Title>
          {hasL2 ? (
            <div>
              <DotSeparatedRow entries={[l2Size]} />
              <DotSeparatedRow entries={[l2Ways]} />
              <PluralizedValue value={l2Banks} singular="Bank" plural="Banks" />
            </div>
          ) : (
            "None"
          )}
        </OffCoreContent>
      </L2Container>
    );
  }
}

L2CacheBlock.propTypes = {
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
};

export default L2CacheBlock;
