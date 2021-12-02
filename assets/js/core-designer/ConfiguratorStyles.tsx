import styled, { css } from "styled-components";
import { transparentize } from "polished";
import { Tabs, TabList, Tab } from "react-tabs";

import { OLD_COLOR, FONT_SIZE, LINE_HEIGHT } from "components/StyledComponents";
import { getStaticRootPath } from "utils/GlobalData";
import { COLOR, PALETTE } from "utils/StyleConstants";

const LOCAL_COLOR = {
  KnobTabTextUnselected: transparentize(0.2, COLOR.TextDark),
  KnobTabPanelText: transparentize(0.2, COLOR.TextDark),
};

export const PageContentMaxWidth = "1080px";

export const MainGridProperties = css`
  display: grid;
  grid-column-gap: 2rem;
  grid-template-columns: minmax(0, 14fr) minmax(0, 43fr) minmax(0, 43fr);
`;

const KnobTabList = styled(TabList)`
  margin: 0;
  padding: 0;
`;

const KnobTabs = Tabs;

const KnobTabPanelContainer = styled.div`
  background-color: ${PALETTE.GrayF0};
  border: 1px solid rgba(205, 205, 205, 0.64);
  border-top: none;
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.02);
  color: ${LOCAL_COLOR.KnobTabPanelText};
`;

const KnobTabPanelContent = styled.div`
  font-size: ${FONT_SIZE.Medium};
  min-height: 40rem;
  padding-left: 3.2rem;
  padding-right: 3.2rem;
`;

const GenericStyledTab = styled(Tab)`
  list-style-type: none;
  font-size: ${FONT_SIZE.Medium};
`;

const KnobTabPanelTitle = styled.div<{ showInsightBadge?: boolean }>`
  color: ${COLOR.TextDark};
  font-size: 1.9rem;
  font-weight: 700;
  line-height: ${LINE_HEIGHT.Small};
  padding: 2rem 3.3rem;
  border-bottom: 1px solid ${PALETTE.GrayD4};

  ${(props) =>
    props.showInsightBadge &&
    css`
      background: url(${getStaticRootPath()}/fcd/images/insight-badge@2x.png)
        top 19px right 26px / 126px 26px no-repeat;
    `}
`;

const KnobTabPanelFooter = styled.div`
  color: ${OLD_COLOR.GrayE2};
  font-size: ${FONT_SIZE.Huge};
  line-height: ${LINE_HEIGHT.Small};
  padding: 2rem 3rem;
  border-top: 1px solid ${PALETTE.GrayD4};
`;

type KnobTabProps = {
  selected: boolean;
};

const tabBackgroundColorFn = (props: KnobTabProps) =>
  props.selected ? PALETTE.GrayE5 : "none";

const tabPaddingLeftFn = (props: KnobTabProps) =>
  props.selected ? "1rem" : "1.4rem";

const KnobTab = styled(GenericStyledTab)`
  min-width: 13rem;
  padding: 0.9rem 0.5rem 0.9rem 1.6rem;
  background-color: ${tabBackgroundColorFn};
  ${(props) =>
    props.selected && `border-left: 4px solid ${COLOR.PrimaryBrand}`};
  color: ${(props) =>
    props.selected ? PALETTE.Gray42 : LOCAL_COLOR.KnobTabTextUnselected};
  cursor: pointer;
  ${(props) => props.selected && "font-weight: 500"};
  outline: none;
  padding-left: ${tabPaddingLeftFn};
  user-select: none;
`;

const KnobTabButton = styled.div`
  background-color: ${PALETTE.GrayF0};
  color: ${PALETTE.CoralRed};
  cursor: pointer;
  border: 1px solid ${PALETTE.GrayD4};
  padding: 10px 15px;
  font-size: 14px;
`;

// https://github.com/reactjs/react-tabs/issues/148
(KnobTabList as any).tabsRole = "TabList";

export {
  KnobTabList,
  KnobTabs,
  KnobTab,
  KnobTabPanelContainer,
  KnobTabPanelTitle,
  KnobTabPanelContent,
  KnobTabPanelFooter,
  KnobTabButton,
};
