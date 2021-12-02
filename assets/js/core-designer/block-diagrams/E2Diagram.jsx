import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";

import Knob from "core-designer/knobs/Knob";
import WebConfigPropType from "core-designer/WebConfigPropType";
import E2CoreBlock from "./E2CoreBlock";
import FrontPortBlock from "./FrontPortBlock";
import SystemPortBlock from "./SystemPortBlock";
import PeripheralPortBlock from "./PeripheralPortBlock";
import DebugBlock from "./DebugBlock";
import ClicBlock from "./ClicBlock";
import ClintBlock from "./ClintBlock";
import Diagram from "./Diagram";
import { BlockDiagramContainer } from "./BlockStyles";

const offCoreBlockTop = 40;
const offCoreBlockTopRem = `${offCoreBlockTop}rem`;
const containerHeight = `${offCoreBlockTop + 10.4}rem`;
const portBlockLeft = "31rem";

const E2BlockDiagramContainer = styled(BlockDiagramContainer)`
  height: ${containerHeight};
`;

class E2Diagram extends Diagram {
  render() {
    const { ipSeries, knobs, webConfig } = this.props;
    return (
      <E2BlockDiagramContainer>
        {this.getTitleBlock()}
        <E2CoreBlock ipSeries={ipSeries} knobs={knobs} webConfig={webConfig} />
        <FrontPortBlock
          top="3rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <SystemPortBlock
          portNum="0"
          top="8rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <SystemPortBlock
          portNum="1"
          top="13rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <PeripheralPortBlock
          top="18rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <DebugBlock
          top={offCoreBlockTopRem}
          width="19.5rem"
          left="1.5rem"
          knobs={knobs}
          webConfig={webConfig}
        />
        {webConfig.has_clic ? (
          <ClicBlock
            top={`${offCoreBlockTopRem}`}
            left="22.5rem"
            width="19.5rem"
            knobs={knobs}
            webConfig={webConfig}
          />
        ) : (
          <ClintBlock
            top={`${offCoreBlockTopRem}`}
            left="22.5rem"
            width="19.5rem"
            knobs={knobs}
            webConfig={webConfig}
          />
        )}
      </E2BlockDiagramContainer>
    );
  }
}

E2Diagram.propTypes = {
  ipSeries: PropTypes.string.isRequired,
  knobs: PropTypes.arrayOf(PropTypes.instanceOf(Knob)).isRequired,
  webConfig: WebConfigPropType.isRequired,
};

export default E2Diagram;
