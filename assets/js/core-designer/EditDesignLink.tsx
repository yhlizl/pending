import React from "react";
import styled from "styled-components";

import { FONT_SIZE, LINE_HEIGHT } from "components/StyledComponents";

const EditLink = styled.a`
  padding-left: 1.6rem;
  font-size: ${FONT_SIZE.Medium};
  font-weight: 500;
  line-height: ${LINE_HEIGHT.Large};
`;

type EditDesignLinkProps = {
  onDesign: (event: React.MouseEvent) => void;
};
const EditDesignLink = (props: EditDesignLinkProps) => (
  <EditLink href="#" onClick={props.onDesign}>
    &#8592;&nbsp;Edit Design
  </EditLink>
);

export default EditDesignLink;
