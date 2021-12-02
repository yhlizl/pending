import styled from "styled-components";
import React from "react";
import PropTypes from "prop-types";

import Knob from "core-designer/knobs/Knob";
import WebConfigPropType from "core-designer/WebConfigPropType";
import E7CoreBlock from "./E7CoreBlock";
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

const offCoreBlockTop = 43;
const offCoreBlockTopRem = `${offCoreBlockTop}rem`;
const containerHeight = `${offCoreBlockTop + 10.5}rem`;
const portBlockLeft = "31rem";

const E7BlockDiagramContainer = styled(BlockDiagramContainer)`
  height: ${containerHeight};
`;

class E7Diagram extends Diagram {
  render() {
    const { ipSeries, knobs, webConfig } = this.props;
    return (
      <E7BlockDiagramContainer>
        {this.getTitleBlock()}
        <E7CoreBlock ipSeries={ipSeries} knobs={knobs} webConfig={webConfig} />
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
      </E7BlockDiagramContainer>
    );
  }
}

E7Diagram.propTypes = {
  ipSeries: PropTypes.string.isRequired,
  knobs: PropTypes.arrayOf(PropTypes.instanceOf(Knob)).isRequired,
  webConfig: WebConfigPropType.isRequired,
};

export default E7Diagram;
