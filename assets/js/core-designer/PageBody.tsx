import React, { useState } from "react";
import styled from "styled-components";

import EmailVerificationMessage from "components/EmailVerificationMessage";
import * as Colors from "utils/Colors";
import { SeriesName, WebConfigType } from "utils/Types";

import ThemedDiagram from "./block-diagrams/ThemedDiagram";
import Knob from "./knobs/Knob";
import { configuratorTabs } from "./Constants";
import DesignSummary from "./DesignSummary";
import EditDesignLink from "./EditDesignLink";
import {
  KnobTabList,
  KnobTabs,
  KnobTabPanelContainer,
  MainGridProperties,
  PageContentMaxWidth,
  KnobTabPanelTitle,
} from "./ConfiguratorStyles";
import { ConfiguratorTab } from "./Tabs";
import KnobPanelFooter from "./KnobPanelFooter";

import ModesAndISATabPanel from "./tabpanels/ModesAndISATabPanel";
import OnChipMemoryTabPanel from "./tabpanels/OnChipMemoryTabPanel";
import PortsTabPanel from "./tabpanels/PortsTabPanel";
import SecurityTabPanel from "./tabpanels/SecurityTabPanel";
import DebugTabPanel from "./tabpanels/DebugTabPanel";
import InterruptsTabPanel from "./tabpanels/InterruptsTabPanel";
import DesignForTestPanel from "./tabpanels/DesignForTestPanel";
import BranchPredictionTabPanel from "./tabpanels/BranchPredictionTabPanel";
import ClocksAndResetTabPanel from "./tabpanels/ClocksAndResetTabPanel";
import RTLOptionsTabPanel from "./tabpanels/RTLOptionTabPanel";

import { knobsToTab } from "../../json/knobs_to_tab";

// Helper Functions

function hasBranchPrediction(ipSeries: SeriesName) {
  // Everything other than 2 series should have a BP panel
  return !ipSeries.includes("2");
}

// https://stackoverflow.com/a/49286056
type ValueOf<T> = T[keyof T];

// TODO: Figure out how to properly type this expression without assertions.
const getConfiguratorTab = (name: string): string | undefined =>
  (configuratorTabs as any)[(knobsToTab as any)[name]];

function getInvalidTabNames(knobs: Knob[], webConfig: WebConfigType) {
  return new Set(
    knobs.map((knob) => {
      const knobTab = getConfiguratorTab(knob.internalName);
      if (!knobTab) {
        throw new Error(`Knob with unknown tab: ${knob.internalName}`);
      }
      if (knob.isValid(webConfig) || knob.isDisabledByContainer(webConfig)) {
        return "";
      }
      return knobTab;
    })
  );
}

const getTabNamesForSeries = (
  ipSeries: SeriesName
): ValueOf<typeof configuratorTabs>[] => {
  const tabNames: ValueOf<typeof configuratorTabs>[] = [
    configuratorTabs.modesAndISA,
    configuratorTabs.onChipMemory,
    configuratorTabs.ports,
    configuratorTabs.security,
    configuratorTabs.debug,
    configuratorTabs.interrupts,
    configuratorTabs.designForTest,
    configuratorTabs.clocksAndReset,
  ];
  if (hasBranchPrediction(ipSeries)) {
    tabNames.push(configuratorTabs.branchPrediction);
  }
  tabNames.push(configuratorTabs.rtlOptions);
  return tabNames;
};

const TAB_NAME_TO_PANEL = {
  [configuratorTabs.modesAndISA]: ModesAndISATabPanel,
  [configuratorTabs.onChipMemory]: OnChipMemoryTabPanel,
  [configuratorTabs.ports]: PortsTabPanel,
  [configuratorTabs.security]: SecurityTabPanel,
  [configuratorTabs.debug]: DebugTabPanel,
  [configuratorTabs.interrupts]: InterruptsTabPanel,
  [configuratorTabs.designForTest]: DesignForTestPanel,
  [configuratorTabs.clocksAndReset]: ClocksAndResetTabPanel,
  [configuratorTabs.branchPrediction]: BranchPredictionTabPanel,
  [configuratorTabs.rtlOptions]: RTLOptionsTabPanel,
};

// Styled components

const FullWidthContainer = styled.div`
  background-color: ${Colors.Gray200};
  display: grid;
  grid-template-columns: minmax(0, ${PageContentMaxWidth});
  justify-content: center;
  min-height: 55rem;
  padding-bottom: 5rem;
`;

const GridParent = styled.div`
  ${MainGridProperties}

  @media print {
    display: block;
  }
`;

const RightColumn = styled.div`
  @media print {
    break-inside: avoid;
  }
`;

const StickyColumnContent = styled.div`
  position: sticky;
  top: 2rem;
  margin-top: 4rem;

  @media print {
    display: none;
  }
`;

const EmailVerificationMargin = styled.div`
  margin-bottom: 2rem;
  margin-top: 1.2rem;
`;

const DesignSummaryWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 1.5rem 2.4rem 4rem;
`;

// Main Component

type PageBodyProps = {
  baseCoreIP: string;
  webConfig: WebConfigType;
  ipSeries: SeriesName;
  isReviewing: boolean;
  knobs: Knob[];
  onDesign: (event: React.MouseEvent) => void;
  onReview: (event: React.MouseEvent) => void;
  reviewButtonEnabled: boolean;
  showEmailVerificationMessage: boolean;
  emailAddress: string;
};
const PageBody = ({
  baseCoreIP,
  webConfig,
  ipSeries,
  isReviewing,
  knobs,
  onDesign,
  onReview,
  reviewButtonEnabled,
  showEmailVerificationMessage,
  emailAddress,
}: PageBodyProps) => {
  const [tabIndex, setTabIndex] = useState(0);

  const diagramColumn = (
    <RightColumn>
      {showEmailVerificationMessage && (
        <EmailVerificationMargin>
          <EmailVerificationMessage
            email={emailAddress}
            message="To build a core you must confirm your email address."
          />
        </EmailVerificationMargin>
      )}
      <ThemedDiagram
        ipSeries={ipSeries}
        webConfig={webConfig}
        knobs={knobs}
        baseCoreIP={baseCoreIP}
      />
    </RightColumn>
  );

  if (isReviewing) {
    return (
      <FullWidthContainer>
        <GridParent>
          <div>
            <StickyColumnContent>
              <EditDesignLink onDesign={onDesign} />
            </StickyColumnContent>
          </div>
          <KnobTabPanelContainer>
            <KnobTabPanelTitle>Settings</KnobTabPanelTitle>
            <DesignSummaryWrapper>
              <DesignSummary
                baseCoreIP={baseCoreIP}
                ipSeries={ipSeries}
                knobs={knobs}
                webConfig={webConfig}
              />
            </DesignSummaryWrapper>
          </KnobTabPanelContainer>
          {diagramColumn}
        </GridParent>
      </FullWidthContainer>
    );
  }

  const invalidTabNames = getInvalidTabNames(knobs, webConfig);
  const tabNames = getTabNamesForSeries(ipSeries);

  const prevButton =
    tabIndex === 0
      ? undefined
      : {
          name: tabNames[tabIndex - 1],
          onClick: () => setTabIndex(tabIndex - 1),
        };
  const nextButton =
    tabIndex === tabNames.length - 1
      ? undefined
      : {
          name: tabNames[tabIndex + 1],
          onClick: () => setTabIndex(tabIndex + 1),
        };

  return (
    <FullWidthContainer>
      <KnobTabs
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
      >
        <GridParent>
          <div>
            <StickyColumnContent>
              <KnobTabList>
                {tabNames.map((name) => (
                  <ConfiguratorTab
                    key={name}
                    name={name}
                    isValid={!invalidTabNames.has(name)}
                  />
                ))}
              </KnobTabList>
            </StickyColumnContent>
          </div>
          <KnobTabPanelContainer>
            {tabNames.map((name) => {
              const Panel = TAB_NAME_TO_PANEL[name];
              return <Panel key={name} ipSeries={ipSeries} />;
            })}
            <KnobPanelFooter
              onReview={onReview}
              reviewButtonEnabled={reviewButtonEnabled}
              prevButton={prevButton}
              nextButton={nextButton}
            />
          </KnobTabPanelContainer>
          {diagramColumn}
        </GridParent>
      </KnobTabs>
    </FullWidthContainer>
  );
};

export default PageBody;
