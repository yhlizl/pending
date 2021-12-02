import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";

import Knob from "core-designer/knobs/Knob";
import WebConfigPropType from "core-designer/WebConfigPropType";
import E3CoreBlock from "./E3CoreBlock";
import FrontPortBlock from "./FrontPortBlock";
import SystemPortBlock from "./SystemPortBlock";
import PeripheralPortBlock from "./PeripheralPortBlock";
import MemoryPortBlock from "./MemoryPortBlock";
import L2CacheBlock from "./L2CacheBlock";
import DebugBlock from "./DebugBlock";
import PlicBlock from "./PlicBlock";
import ClintBlock from "./ClintBlock";
import Diagram from "./Diagram";
import { BlockDiagramContainer } from "./BlockStyles";

const offCoreBlockTop = 40;
const containerHeight = `${offCoreBlockTop + 10.4}rem`;
const E3BlockDiagramContainer = styled(BlockDiagramContainer)`
  height: ${containerHeight};
`;

const offCoreBlockTopRem = `${offCoreBlockTop}rem`;
const portBlockLeft = "31rem";

class E3Diagram extends Diagram {
  render() {
    const { ipSeries, knobs, webConfig } = this.props;
    return (
      <E3BlockDiagramContainer>
        {this.getTitleBlock()}
        <E3CoreBlock ipSeries={ipSeries} knobs={knobs} webConfig={webConfig} />
        <FrontPortBlock
          top="3rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <SystemPortBlock
          top="8rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <PeripheralPortBlock
          top="13rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <MemoryPortBlock
          top="18rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <L2CacheBlock
          top="23rem"
          left={portBlockLeft}
          knobs={knobs}
          webConfig={webConfig}
        />
        <DebugBlock
          top={offCoreBlockTopRem}
          width="15rem"
          left="1.5rem"
          knobs={knobs}
          webConfig={webConfig}
        />
        <PlicBlock
          top={offCoreBlockTopRem}
          left="17.5rem"
          width="15rem"
          knobs={knobs}
          webConfig={webConfig}
        />
        <ClintBlock
          width="9rem"
          top={offCoreBlockTopRem}
          left="33.5rem"
          knobs={knobs}
          webConfig={webConfig}
        />
      </E3BlockDiagramContainer>
    );
  }
}

E3Diagram.propTypes = {
  ipSeries: PropTypes.string.isRequired,
  knobs: PropTypes.arrayOf(PropTypes.instanceOf(Knob)).isRequired,
  webConfig: WebConfigPropType.isRequired,
};

export default E3Diagram;
