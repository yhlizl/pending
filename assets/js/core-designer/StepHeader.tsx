import React from "react";
import styled from "styled-components";

import { FONT_SIZE } from "components/StyledComponents";
import * as Colors from "utils/Colors";

const BorderColor = Colors.Gray400;

const Container = styled.div`
  background-color: ${Colors.Gray300};
  border-bottom: solid 1px ${BorderColor};
  display: flex;
  font-size: ${FONT_SIZE.Small};
  font-weight: 500;
`;

const Step = styled.div<{ isActive: boolean }>`
  color: ${(props) => (props.isActive ? Colors.TextDark : Colors.Gray500)};
  flex-basis: 0;
  padding: 1.2rem 12rem;
`;

const Step1 = styled(Step)`
  flex-grow: 3;
  text-align: right;
`;

const Step2 = styled(Step)`
  border-left: solid 1px ${BorderColor};
  border-right: solid 1px ${BorderColor};
  flex-grow: 1;
  text-align: center;
`;

const Step3 = styled(Step)`
  flex-grow: 3;
  text-align: left;
`;

const Number = styled.span`
  margin-right: 1rem;
`;

type StepHeaderProps = {
  activeStep: 1 | 2 | 3;
};

const StepHeader = ({ activeStep }: StepHeaderProps) => {
  return (
    <Container>
      <Step1 isActive={activeStep === 1}>
        <Number>01.</Number>Design
      </Step1>
      <Step2 isActive={activeStep === 2}>
        <Number>02.</Number>Review
      </Step2>
      <Step3 isActive={activeStep === 3}>
        <Number>03.</Number>Build
      </Step3>
    </Container>
  );
};

export default StepHeader;
