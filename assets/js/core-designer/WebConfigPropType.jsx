import PropTypes from "prop-types";

import e2KnobSpecs from "../../json/choices/e2.json";
import e3KnobSpecs from "../../json/choices/e3.json";
import s5KnobSpecs from "../../json/choices/s5.json";

function getShapeObj(spec) {
  const shapeObj = {
    ip_series: PropTypes.string.isRequired,
  };
  for (let i = 0; i < spec.length; i += 1) {
    const knobSpec = spec[i];
    if (knobSpec.number) {
      shapeObj[knobSpec.number.internalName] = PropTypes.number.isRequired;
    }
    if (knobSpec.radio) {
      shapeObj[knobSpec.radio.internalName] = PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
      ]);
    }
    if (knobSpec.slider) {
      shapeObj[knobSpec.slider.internalName] = PropTypes.number.isRequired;
    }
  }
  return PropTypes.shape(shapeObj);
}

const e2Shape = getShapeObj(e2KnobSpecs);
const e3Shape = getShapeObj(e3KnobSpecs);
const s5Shape = getShapeObj(s5KnobSpecs);

const WebConfigType = PropTypes.oneOfType([e2Shape, e3Shape, s5Shape]);

export default WebConfigType;
