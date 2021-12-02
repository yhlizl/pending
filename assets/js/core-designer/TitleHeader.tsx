import React from "react";
import styled from "styled-components";
import { FaPencilAlt } from "react-icons/fa";

import * as Colors from "utils/Colors";
import {
  FONT_FAMILY,
  FONT_SIZE,
  LINE_HEIGHT,
} from "../components/StyledComponents";
import { ConfiguratorMainButton } from "../components/Button";
import InlineEditableField, {
  NonEditingStyle,
  EditingStyle,
} from "./InlineEditableField";
import { MainGridProperties, PageContentMaxWidth } from "./ConfiguratorStyles";

// Helper functions

const DEFAULT_NAMES = [
  "Untitled E2 Core",
  "Untitled E3 Core",
  "Untitled S5 Core",
  "Untitled Chip",
];

const isDefaultName = (name: string) => DEFAULT_NAMES.includes(name);

// Styled components

const FullWidthContainer = styled.div`
  background-color: ${Colors.Gray300};
  display: grid;
  grid-template-columns: minmax(0, ${PageContentMaxWidth});
  justify-content: center;
`;

// Main Grid

const GridParent = styled.div`
  ${MainGridProperties}

  align-items: center;
`;

const GridAreaTitle = styled.div`
  align-items: baseline;
  display: grid;
  grid-column: 2;
  grid-column-gap: 2rem;
  grid-template-areas:
    "eyebrow saving"
    "name name";
  grid-template-columns: auto 1fr;
  padding-bottom: 2rem;
  padding-top: 3rem;
`;

const GridAreaAction = styled.div`
  align-items: center;
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 2rem;
  grid-column: 3;
  justify-content: end;
  padding-bottom: 1.2rem;
  padding-top: 1.2rem;

  @media print {
    display: none;
  }
`;

// Leaf components

const Eyebrow = styled.div`
  color: ${Colors.Gray600};
  font-family: ${FONT_FAMILY.Display};
  font-size: ${FONT_SIZE.Medium};
  font-weight: 700;
  line-height: ${LINE_HEIGHT.Medium};
  padding-left: 0.1rem; /* Accounts for the sometimes transparent border on the NameIconContainer */
  grid-area: eyebrow;
`;

type DesignNameWrapperProps = {
  isDefaultName: boolean;
};
const DesignNameWidget = styled.div<DesignNameWrapperProps>`
  align-items: center;
  color: ${Colors.Gray500};
  column-gap: 1rem;
  display: flex;
  grid-area: name;

  &:hover {
    color: ${Colors.TextDark};
  }

  ${NonEditingStyle},
  ${EditingStyle} {
    background-color: transparent;
    border: 1px solid transparent;
    color: ${Colors.TextDark};
    display: inline-block;
    font-family: ${FONT_FAMILY.Display};
    font-size: 3.4rem;
    font-weight: 700;
    /* This is the smallest line-height we can use, or else Firefox and Safari's
     * text insertion caret will stretch the height of the input box when
     * switching to editing mode.
     *
     * https://stackoverflow.com/q/33185205
     * */
    line-height: 1.3;
    min-width: 10rem;
    /* Set margin-left to the exact opposite of padding-left value so that left
     * side of text within the span is vertically aligned with its neighbors. */
    margin-left: -0.5rem;
    padding: 0.5rem;
    word-break: break-word;

    ${(props) => props.isDefaultName && "font-style: italic;"}
  }

  &:hover ${NonEditingStyle}, ${EditingStyle} {
    border-color: ${Colors.Gray500};
  }
`;

const StyledPencil = styled(FaPencilAlt)`
  @media print {
    display: none;
  }
`;

const SavingMessage = styled.span`
  color: rgba(42, 42, 42, 0.65);
  font-weight: 400;
  font-size: ${FONT_SIZE.Small};
  grid-area: saving;
  line-height: ${LINE_HEIGHT.Small};
`;

// Main component

type TitleHeaderProps = {
  eyebrow: string;
  inflightSave: boolean;
  justFinishedSaving: boolean;
  designName: string;
  setDesignName: (newName: string) => void;
  onReview: (e: React.MouseEvent) => void;
  onBuild: (e: React.MouseEvent) => void;
  isReviewing: boolean;
  reviewButtonEnabled: boolean;
  buildButtonEnabled: boolean;
  buildButtonText: React.ReactNode;
  buildWarning?: React.ReactNode;
};

const TitleHeader = ({
  eyebrow,
  inflightSave,
  justFinishedSaving,
  designName,
  setDesignName,
  onReview,
  onBuild,
  isReviewing,
  reviewButtonEnabled,
  buildButtonEnabled,
  buildButtonText,
  buildWarning,
}: TitleHeaderProps) => {
  let savingText = "";
  if (justFinishedSaving) {
    savingText = "Changes saved";
  }
  if (inflightSave) {
    savingText = "Saving...";
  }

  let buttonToShow;
  if (isReviewing) {
    buttonToShow = (
      <ConfiguratorMainButton onClick={onBuild} disabled={!buildButtonEnabled}>
        {buildButtonText}
      </ConfiguratorMainButton>
    );
  } else {
    buttonToShow = (
      <ConfiguratorMainButton
        onClick={onReview}
        disabled={!reviewButtonEnabled}
      >
        <span>Review</span>
      </ConfiguratorMainButton>
    );
  }

  return (
    <FullWidthContainer>
      <GridParent>
        <GridAreaTitle>
          <Eyebrow>{eyebrow}</Eyebrow>
          <SavingMessage>{savingText}</SavingMessage>
          <DesignNameWidget isDefaultName={isDefaultName(designName)}>
            <InlineEditableField value={designName} onChange={setDesignName} />
            <StyledPencil />
          </DesignNameWidget>
        </GridAreaTitle>
        <GridAreaAction>
          {buildWarning}
          {buttonToShow}
        </GridAreaAction>
      </GridParent>
    </FullWidthContainer>
  );
};

export default TitleHeader;
