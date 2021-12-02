import React, { useState } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import WithTooltip from "components/WithTooltip";
import { VStack } from "components/Spacing";
import { FONT_SIZE, LINE_HEIGHT } from "components/StyledComponents";
import { PALETTE, COLOR } from "utils/StyleConstants";
import { InfoMessage } from "components/MessageComponents";
import ContactSalesModal from "components/ContactSalesModal";
import LinkStyledButton from "components/LinkStyledButton";

const Bold = styled.span`
  font-weight: 500;
`;

/** A section of the knob panel.
 *
 * If the isNotification prop is true, then style the section as a container for
 * non-knob notification messages that appear at the top of the panel content.
 */
export const TabSection = ({ title, tooltip, isNotification, children }) => (
  <TabSectionContainer isNotification={isNotification}>
    {title && <TabTitle title={title} tooltip={tooltip} />}
    {children}
  </TabSectionContainer>
);

TabSection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  tooltip: PropTypes.string,
  isNotification: PropTypes.bool,
};

TabSection.defaultProps = {
  title: null,
  tooltip: null,
  isNotification: false,
};

const TabTitle = ({ title, tooltip }) => (
  <TabSectionTitleStyle>
    {tooltip ? <WithTooltip msg={tooltip}>{title}</WithTooltip> : title}
  </TabSectionTitleStyle>
);

TabTitle.propTypes = {
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
};

TabTitle.defaultProps = {
  tooltip: null,
};

export const PanelRestrictionMessage = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <InfoMessage backgroundColor={PALETTE.White}>
      <p>
        Evaluation RTL will have limited cache, TIM, and port sizes. FPGA
        bitstreams will be unaffected.
      </p>
      <ContactSalesModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      />
      <p>
        To upgrade,{" "}
        <LinkStyledButton onClick={() => setModalIsOpen(true)}>
          contact us
        </LinkStyledButton>
        .
      </p>
    </InfoMessage>
  );
};

export const KnobRestrictionMessage = ({
  restrictionName,
  restrictionValue,
  extraMessage,
}) => (
  <InfoMessage backgroundColor={COLOR.BackgroundLight}>
    {restrictionName} will be limited to {restrictionValue} in evaluation RTL.
    {extraMessage}
  </InfoMessage>
);

KnobRestrictionMessage.propTypes = {
  extraMessage: PropTypes.string,
  restrictionName: PropTypes.string.isRequired,
  restrictionValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
};

KnobRestrictionMessage.defaultProps = {
  extraMessage: null,
};

export const KnobInfoMessage = ({ boldMessage, children }) => (
  <InfoMessage backgroundColor={COLOR.BackgroundLight}>
    {boldMessage && (
      <>
        <Bold>{boldMessage}</Bold>{" "}
      </>
    )}
    {children}
  </InfoMessage>
);

KnobInfoMessage.propTypes = {
  boldMessage: PropTypes.string,
  children: PropTypes.node.isRequired,
};

KnobInfoMessage.defaultProps = {
  boldMessage: undefined,
};

/** Container for listing consecutive checkboxes, with smaller spacing. */
export const Checklist = ({ children }) => (
  <VStack gap="1.6rem">{children}</VStack>
);

Checklist.propTypes = {
  children: PropTypes.node.isRequired,
};

// ========================================================================== //
//                                                                            //
//                          Styled Components                                 //
//                     (Used only within this file)                           //
//                                                                            //
// ========================================================================== //

const TabSectionContainer = styled.div`
  display: grid;
  grid-row-gap: 2.4rem;
  padding-top: 2.4rem;

  ${(props) =>
    !props.isNotification &&
    css`
      padding-bottom: 4.8rem;

      &:not(:last-child) {
        border-bottom: 1px solid ${PALETTE.GrayDF};
      }
    `}
`;

const TabSectionTitleStyle = styled.div`
  font-size: ${FONT_SIZE.Large};
  font-weight: 600;
  line-height: ${LINE_HEIGHT.Medium};
`;
