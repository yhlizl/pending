import React from "react";
import PropTypes from "prop-types";

import Knob from "core-designer/knobs/Knob";
import WebConfigPropType from "core-designer/WebConfigPropType";

class DiagramBlock extends React.Component {
  static propTypes = {
    webConfig: WebConfigPropType.isRequired,
    knobs: PropTypes.arrayOf(PropTypes.instanceOf(Knob)).isRequired,
  };

  constructor(props) {
    super(props);
    this.knobMap = new Map();
    this.props.knobs.forEach((k) => this.knobMap.set(k.internalName, k));
  }

  getDisplayValue(name) {
    const knob = this.knobMap.get(name);
    if (!knob) {
      return "";
    }
    return knob.getBlockDisplayValue(this.props.webConfig);
  }

  getDisplayName(name) {
    const knob = this.knobMap.get(name);
    if (!knob) {
      return "";
    }
    return knob.displayName;
  }

  getInternalValue(name) {
    if (name in this.props.webConfig) {
      return this.props.webConfig[name];
    }
    return false;
  }

  getReviewValue(name) {
    const knob = this.knobMap.get(name);
    if (!knob) {
      return "";
    }
    return knob.getReviewValue(this.props.webConfig);
  }
}

export default DiagramBlock;
