import React from "react";
import styled from "styled-components";
import { AnimateOnChange } from "react-animation";
import { FaExternalLinkAlt } from "react-icons/fa";
import PropTypes from "prop-types";

import { wwwLearnAboutCoreURL } from "api/URLs";
import WebConfigPropType from "core-designer/WebConfigPropType";
import { OLD_COLOR, FONT_SIZE, LINE_HEIGHT } from "components/StyledComponents";

const TitleBlock = styled.div`
  color: ${OLD_COLOR.Dark};
  position: absolute;
  top: 1rem;
  left: 1.5rem;
  font-size: ${FONT_SIZE.Small};
  line-height: ${LINE_HEIGHT.Small};
`;

const StrongTitle = styled.span`
  font-weight: 500;
`;

const BaseLinkContainer = styled.div`
  line-height: 0.1rem;
  bottom: -2.8rem;
  left: 0;
  font-size: 1.2rem;
  color: #888;
  position: absolute;
`;

const BaseLink = styled.a`
  font-size: 1.2rem;
  color: #888;
  display: inline-block;
  border-bottom: solid 1px #aaa;
`;

const BaseIcon = styled(FaExternalLinkAlt)`
  position: relative;
  top: -1px;
  vertical-align: middle;
`;

class Diagram extends React.Component {
  static propTypes = {
    webConfig: WebConfigPropType.isRequired,
    baseCoreIP: PropTypes.string.isRequired,
  };

  getTitleBlock() {
    const learnMoreUrl = wwwLearnAboutCoreURL(this.props.baseCoreIP);
    return (
      <>
        <TitleBlock>
          <StrongTitle>
            <AnimateOnChange>
              {this.props.webConfig.design_name}
            </AnimateOnChange>
          </StrongTitle>
          &nbsp;Core Complex
        </TitleBlock>
        <BaseLinkContainer>
          Base:&nbsp;
          <BaseLink
            href={learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props.baseCoreIP} Standard Core <BaseIcon />
          </BaseLink>
        </BaseLinkContainer>
      </>
    );
  }
}

export default Diagram;
