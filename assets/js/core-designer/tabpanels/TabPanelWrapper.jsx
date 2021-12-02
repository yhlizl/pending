import React from "react";
import PropTypes from "prop-types";

import { HelpIcon } from "core-designer/knobs/KnobStyles";
import WithTooltip from "components/WithTooltip";
import { KnobTabPanelTitle } from "../ConfiguratorStyles";
import { configuratorTabs } from "../Constants";

export const TabPanelWrapper = ({ tabName, selected, tooltip, children }) => {
  if (!selected) return null;

  const showInsightBadge = tabName === configuratorTabs.debug;
  return (
    <div>
      <KnobTabPanelTitle showInsightBadge={showInsightBadge}>
        {tabName}
        {tooltip && (
          <WithTooltip msg={tooltip}>
            <HelpIcon />
          </WithTooltip>
        )}
      </KnobTabPanelTitle>
      {children}
    </div>
  );
};

TabPanelWrapper.propTypes = {
  tabName: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  tooltip: PropTypes.string,
  children: PropTypes.node.isRequired,
};

TabPanelWrapper.defaultProps = {
  tooltip: "",
  selected: false,
};
