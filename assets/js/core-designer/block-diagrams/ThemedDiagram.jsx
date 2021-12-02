import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";
import { darken, transparentize } from "polished";

import { COLOR, PALETTE } from "utils/StyleConstants";
import Knob from "core-designer/knobs/Knob";
import WebConfigPropType from "core-designer/WebConfigPropType";
import E2Diagram from "./E2Diagram";
import E3Diagram from "./E3Diagram";
import E7Diagram from "./E7Diagram";

const darkAccent = (color) => darken(0.09, color);
const containedAccent = (color) => darken(0.06, color);
const accentDisabled = (color) => transparentize(0.7, color);
const AccentGreenDiagram = darken(0.1, COLOR.AccentGreen);

const THEMES = {
  E2: {
    accentForegroundColor: "rgba(255,255,255,0.9)",
    accentColor: COLOR.AccentOrange,
    accentColorLight: containedAccent(COLOR.AccentOrange),
    accentColorLightDisabled: accentDisabled(COLOR.AccentOrangeLight),
    accentColorDark: darkAccent(COLOR.AccentOrange),
    accentColorDisabled: accentDisabled(COLOR.AccentOrange),
  },
  E3: {
    accentForegroundColor: PALETTE.White,
    accentColor: AccentGreenDiagram,
    accentColorLight: containedAccent(AccentGreenDiagram),
    accentColorLightDisabled: accentDisabled(COLOR.AccentGreenLight),
    accentColorDark: darkAccent(AccentGreenDiagram),
  },
  E7: {
    accentForegroundColor: "rgba(255,255,255,0.9)",
    accentColor: COLOR.AccentBlue,
    accentColorLight: containedAccent(COLOR.AccentBlue),
    accentColorLightDisabled: transparentize(0.65, COLOR.AccentBlueLight),
    accentColorDark: darkAccent(COLOR.AccentBlue),
  },
  S2: {
    accentForegroundColor: "rgba(255,255,255,0.9)",
    accentColor: COLOR.AccentOrange,
    accentColorLight: containedAccent(COLOR.AccentOrange),
    accentColorLightDisabled: accentDisabled(COLOR.AccentOrangeLight),
    accentColorDark: darkAccent(COLOR.AccentOrange),
    accentColorDisabled: accentDisabled(COLOR.AccentOrange),
  },
  S5: {
    accentForegroundColor: "rgba(255,255,255,0.9)",
    accentColor: COLOR.AccentPurple,
    accentColorLight: containedAccent(COLOR.AccentPurple),
    accentColorLightDisabled: transparentize(0.65, COLOR.AccentPurpleLight),
    accentColorDark: darkAccent(COLOR.AccentPurple),
  },
  S7: {
    accentForegroundColor: "rgba(255,255,255,0.9)",
    accentColor: COLOR.AccentBlue,
    accentColorLight: containedAccent(COLOR.AccentBlue),
    accentColorLightDisabled: transparentize(0.65, COLOR.AccentBlueLight),
    accentColorDark: darkAccent(COLOR.AccentBlue),
  },
  U5: {
    accentForegroundColor: "rgba(255,255,255,0.9)",
    accentColor: COLOR.AccentPurple,
    accentColorLight: containedAccent(COLOR.AccentPurple),
    accentColorLightDisabled: transparentize(0.65, COLOR.AccentPurpleLight),
    accentColorDark: darkAccent(COLOR.AccentPurple),
  },
  U7: {
    accentForegroundColor: "rgba(255,255,255,0.9)",
    accentColor: COLOR.AccentBlue,
    accentColorLight: containedAccent(COLOR.AccentBlue),
    accentColorLightDisabled: transparentize(0.65, COLOR.AccentBlueLight),
    accentColorDark: darkAccent(COLOR.AccentBlue),
  },
};

const ThemedDiagram = (props) => {
  // TODO: Shouldn't have to do this check here, ideally this logic would live higher-up with
  // similar logic to decide if a core has a diagram.
  if (!props.ipSeries) {
    return null;
  }
  const ipFamily = props.ipSeries.toUpperCase();

  const Diagram = {
    E2: E2Diagram,
    E3: E3Diagram,
    E7: E7Diagram,
    S2: E2Diagram,
    S5: E3Diagram,
    S7: E7Diagram,
    U5: E3Diagram,
    U7: E7Diagram,
  }[ipFamily];
  const theme = THEMES[ipFamily];
  if (!theme) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <Diagram
        ipSeries={ipFamily}
        webConfig={props.webConfig}
        knobs={props.knobs}
        baseCoreIP={props.baseCoreIP}
      />
    </ThemeProvider>
  );
};

ThemedDiagram.propTypes = {
  ipSeries: PropTypes.string.isRequired,
  knobs: PropTypes.arrayOf(PropTypes.instanceOf(Knob)).isRequired,
  webConfig: WebConfigPropType.isRequired,
  baseCoreIP: PropTypes.string.isRequired,
};

export default ThemedDiagram;
