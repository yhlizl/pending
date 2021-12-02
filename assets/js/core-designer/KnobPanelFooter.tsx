import React from "react";
import styled from "styled-components";

import { PrimaryButton } from "components/Button";
import { KnobTabPanelFooter, KnobTabButton } from "./ConfiguratorStyles";

// ========================================================================== //
//                                                                            //
//                             Main Component                                 //
//                                                                            //
// ========================================================================== //

type ButtonProps = {
  name: string;
  onClick: (event: React.MouseEvent) => void;
};

type KnobPanelFooterProps = {
  reviewButtonEnabled: boolean;
  onReview: (event: React.MouseEvent) => void;
  prevButton?: ButtonProps;
  nextButton?: ButtonProps;
};

const KnobPanelFooter = ({
  reviewButtonEnabled,
  onReview,
  prevButton,
  nextButton,
}: KnobPanelFooterProps) => {
  if (prevButton) {
    if (nextButton) {
      // prevButton && nextButton
      return (
        <KnobTabPanelFooter>
          <TabButtonsContainer>
            <PrevButton name={prevButton.name} onClick={prevButton.onClick} />
            <NextButton name={nextButton.name} onClick={nextButton.onClick} />
          </TabButtonsContainer>
        </KnobTabPanelFooter>
      );
    }
    // prevButton && !nextButton
    return (
      <KnobTabPanelFooter>
        <TabButtonsContainer>
          <PrevButton name={prevButton.name} onClick={prevButton.onClick} />
          <ReviewButton enabled={reviewButtonEnabled} onClick={onReview} />
        </TabButtonsContainer>
      </KnobTabPanelFooter>
    );
  }
  if (nextButton) {
    // !prevButton && nextButton
    return (
      <KnobTabPanelFooter>
        <OnlyNextButtonContainer>
          <NextButton name={nextButton.name} onClick={nextButton.onClick} />
        </OnlyNextButtonContainer>
      </KnobTabPanelFooter>
    );
  }
  // !prevButton && !nextButton
  throw new Error("At least one of prevButton and nextButton must be defined.");
};

// ========================================================================== //
//                                                                            //
//                             Sub-Components                                 //
//                                                                            //
// ========================================================================== //

const NextButton = ({ name, onClick }: ButtonProps) => (
  <KnobTabButton onClick={onClick}>{name} &rarr;</KnobTabButton>
);

const PrevButton = ({ name, onClick }: ButtonProps) => (
  <KnobTabButton onClick={onClick}>&larr; {name}</KnobTabButton>
);

type ReviewButtonProps = {
  enabled: boolean;
  onClick: (event: React.MouseEvent) => void;
};

const ReviewButton = ({ enabled, onClick }: ReviewButtonProps) => {
  const clickFunction = enabled ? onClick : undefined;
  return (
    <PrimaryButton
      disabled={!enabled}
      onClick={clickFunction}
      buttonSize="small"
    >
      Review
    </PrimaryButton>
  );
};

// ========================================================================== //
//                                                                            //
//                            Styled Components                               //
//                                                                            //
// ========================================================================== //

const TabButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const OnlyNextButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default KnobPanelFooter;
