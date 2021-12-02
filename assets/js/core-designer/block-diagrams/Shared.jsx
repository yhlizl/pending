import React from "react";
import PropTypes from "prop-types";
import { AnimateOnChange } from "react-animation";
import pluralized from "utils/pluralized";
import {
  HalfContainedCoreBlock,
  Bold,
  TextEntrySeparated,
  TextEntry,
} from "./BlockStyles";

export const ValueText = (props) => (
  <TextEntry>
    <AnimateOnChange>{props.children}</AnimateOnChange>
  </TextEntry>
);

ValueText.propTypes = {
  children: PropTypes.node.isRequired,
};

const DotSeparatedValueText = (props) => (
  <TextEntrySeparated>
    <AnimateOnChange>{props.children}</AnimateOnChange>
  </TextEntrySeparated>
);

DotSeparatedValueText.propTypes = {
  children: PropTypes.node.isRequired,
};

export const DotSeparatedRow = ({ entries }) => {
  const filteredEntries = entries.filter((entry) => entry);
  return (
    <div>
      {filteredEntries.map((entry, index) => {
        const entryKey = `${index}Key`;
        return (
          <DotSeparatedValueText key={entryKey}>{entry}</DotSeparatedValueText>
        );
      })}
    </div>
  );
};

DotSeparatedRow.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export const PluralizedValue = ({ value, singular, plural }) => (
  <ValueText>{pluralized(value, singular, plural)}</ValueText>
);

PluralizedValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  singular: PropTypes.string.isRequired,
  plural: PropTypes.string.isRequired,
};

export const InternalBlock = ({ label, enabled, entries, rightAlign }) => (
  <HalfContainedCoreBlock
    margin={rightAlign && "0 0 0 1rem"}
    disabled={!enabled}
  >
    <Bold>{label}</Bold>
    {enabled ? <DotSeparatedRow entries={entries} /> : <div>None</div>}
  </HalfContainedCoreBlock>
);

InternalBlock.propTypes = {
  label: PropTypes.string.isRequired,
  enabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  entries: PropTypes.arrayOf(PropTypes.string).isRequired,
  rightAlign: PropTypes.bool,
};

InternalBlock.defaultProps = {
  rightAlign: false,
};
