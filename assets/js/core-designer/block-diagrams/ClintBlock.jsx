import PropTypes from "prop-types";

import OffCoreBlock from "./OffCoreBlock";

class ClintBlock extends OffCoreBlock {
  constructor(props) {
    super(props);
    this.displayName = "CLINT";
  }

  /* eslint-disable-next-line class-methods-use-this */
  getContent() {
    return null;
  }

  /* eslint-disable-next-line class-methods-use-this */
  isEnabled() {
    return true;
  }
}

ClintBlock.propTypes = {
  top: PropTypes.string.isRequired,
  left: PropTypes.string.isRequired,
};

export default ClintBlock;
