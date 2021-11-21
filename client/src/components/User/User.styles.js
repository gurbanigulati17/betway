import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { pxToRem } from "../../styles/utils";

const desktopStyle = css`
  padding-bottom: 0;

  .sidebar {
    flex: 0 1 ${pxToRem(300)};
    position: static;
  }

  #main {
    max-height: 100%;
    padding-top: ${pxToRem(10)};
    padding-bottom: ${pxToRem(10)};
    max-height: calc(100% - 80px);
  }
`;

export default css`
  height: 100%;
  overflow: hidden;
  background-color: #ededed;
  padding-bottom: 60px;

  .main-layout {
    height: 100%;
    display: flex;
    width: 100%;
  }

  .sidebar {
    flex: 0 1 100%;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    overflow: visible;
    z-index: 99;
    transition: 0.25s ease-in left;
  }

  #main {
    flex: 1;
    overflow: auto;
    max-height: calc(100% - 55px);
  }

  .trigger-close {
    color: ${(props) => props.theme.colors.textLight};
    right: 0;
    left: auto;
    top: 0;
    font-size: ${pxToRem(25)};
    display: none;
  }

  .slide-out {
    left: -100%;
    right: auto;
  }

  .slide-in {
    left: 0;
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
