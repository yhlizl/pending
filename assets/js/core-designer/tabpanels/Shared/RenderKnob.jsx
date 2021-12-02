import { connect } from "react-redux";

import { shouldKnobBeRendered } from "core-designer/knobs/ConstraintUtil";

/*
  This is the component that returns the JSX for rendering a knob
  in the UI. It only requires an 'internalName' -- the knobMap and
  webConfig are read from Redux. 'activeTabKnob' and 'activeTabSubsection'
  are optional and only by tabs with edit button (PortsTabPanel, PeripheralsTabPanel) for boolean port knobs.
*/

const RenderKnob = ({
  internalName,
  knobMap,
  webConfig,
  activeTabKnob,
  activeTabSubsection,
  onTabSubsectionClick,
}) => {
  if (!shouldKnobBeRendered(internalName)) return null;

  const knob = knobMap.get(internalName);
  if (!knob) {
    throw new Error(`Cannot find knob with internal name ${internalName}`);
  }
  const knobState = {
    ...webConfig,
    activeTabKnob,
    activeTabSubsection,
    onTabSubsectionClick,
  };
  return knob.getFormElements(knobState);
};

const mapStateToProps = (state) => ({
  webConfig: state.coreDesigner.webConfig,
  knobMap: state.coreDesigner.knobMap,
});

export default connect(mapStateToProps)(RenderKnob);
