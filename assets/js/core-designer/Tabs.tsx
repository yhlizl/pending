import React from "react";
import styled from "styled-components";

import { ErrorIcon } from "components/Icons";
import { KnobTab } from "./ConfiguratorStyles";

const TabNameContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

type ConfiguratorTabProps = {
  selected?: boolean;
  isValid: boolean;
  name: string;
};

const ConfiguratorTab = ({
  name,
  isValid,
  selected = false,
}: ConfiguratorTabProps) => {
  return (
    <KnobTab selected={selected}>
      <TabNameContainer>
        <div>{name}</div>
        {isValid || <ErrorIcon />}
      </TabNameContainer>
    </KnobTab>
  );
};

ConfiguratorTab.tabsRole = "Tab";

export { ConfiguratorTab };
