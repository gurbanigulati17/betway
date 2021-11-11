import { css } from "styled-components";

import breakpoint from "styled-components-breakpoint";
import { hexToRgbA, pxToRem } from "../../../../styles/utils";

const desktopStyle = css`
  padding-top: ${pxToRem(60)};
`;

export default css`
  background: #53555b;
  color: ${(props) => props.theme.colors.textLight};
  position: fixed;
  overflow: auto;
  z-index: 5;
  transition: all 0.25s ease 0s;
  width: ${pxToRem(230)};
  right: -230px;
  top: 0;
  bottom: 0;
  left: auto;
  padding-top: ${pxToRem(105)};

  &.show {
    right: 0;
  }

  .username {
    text-align: center;
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #b8c7ce;
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
