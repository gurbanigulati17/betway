import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { pxToRem } from "../../styles/utils";
import bgImage from "../../assets/images/bgimg.jpeg";

const desktopStyle = css`
  .sidebar {
    flex: 0 1 ${pxToRem(240)};
    position: static;
  }

  .trigger-open,
  .trigger-close {
    display: none;
  }

  #main {
    max-height: 100%;
    padding-top: ${pxToRem(10)};
    padding-bottom: ${pxToRem(10)};
  }
`;

export default css`
  height: 100%;
  overflow: hidden;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${bgImage});

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
    max-height: calc(100% - 80px);
  }

  .trigger-open,
  .trigger-close {
    padding: 0;
    margin: 0;
    background: transparent;
    border: 0;
    position: absolute;
    top: ${pxToRem(5)};
    z-index: 30;
    left: ${pxToRem(0)};
    padding: ${pxToRem(10)};
    font-size: ${pxToRem(25)};
    color: ${(props) => props.theme.colors.textLight};
  }

  .trigger-open {
    font-size: ${pxToRem(14)};
    top: ${pxToRem(57)};
    padding: ${pxToRem(20)};
  }

  .trigger-close {
    color: ${(props) => props.theme.colors.textLight};
    right: 0;
    left: auto;
    top: 0;
    font-size: ${pxToRem(25)};
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
