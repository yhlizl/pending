import { connect } from "react-redux";


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

  const knob = knobMap.get(internalName);

  const knobState = {
    ...webConfig,
    activeTabKnob,
    activeTabSubsection,
    onTabSubsectionClick,
  };
  return knob;
};

const mapStateToProps = (state) => ({
  webConfig: state.coreDesigner.webConfig,
  knobMap: state.coreDesigner.knobMap,
});

export default connect(mapStateToProps)(RenderKnob);
