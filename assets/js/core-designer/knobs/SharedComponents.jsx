import React from "react";
import PropTypes from "prop-types";

import WithTooltip from "components/WithTooltip";
import { HelpIcon, Title, BoldKnobName } from "./KnobStyles";

export const KnobTitle = ({ displayName, tooltip, bold, disabled }) => (
  <Title disabled={disabled}>
    {bold ? (
      <BoldKnobName>{displayName}</BoldKnobName>
    ) : (
      <span>{displayName}</span>
    )}
    {tooltip && (
      <WithTooltip msg={tooltip}>
        <HelpIcon />
      </WithTooltip>
    )}
  </Title>
);

KnobTitle.propTypes = {
  displayName: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  bold: PropTypes.bool,
  disabled: PropTypes.bool,
};

KnobTitle.defaultProps = {
  tooltip: "",
  bold: false,
  disabled: false,
};
