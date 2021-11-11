import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { hexToRgbA, pxToRem } from "../../../styles/utils";

const desktopStyle = css`
  box-shadow: ${(props) => hexToRgbA(props.theme.colors.black, 0.3)} 2px 2px
      10px,
    ${(props) => hexToRgbA(props.theme.colors.black, 0.08)} -1px 0px 4px;
  padding-top: 0px;

  ul {
    ul {
      .name {
        width: ${pxToRem(170)};
      }
    }
  }
`;

export default css`
  overflow: hidden auto;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  z-index: 0;
  background-color: #222d32;
  height: 100%;
  padding-bottom: 20px;
  padding-top: 40px;

  .hide {
    display: none;
  }

  .show {
    display: block;
  }

  h3 {
    text-transform: uppercase;
    font-size: ${(props) => pxToRem(props.theme.font.sizeSmall, 0.3)};
    padding-left: ${pxToRem(13)};
    color: ${(props) => props.theme.colors.primary};
    margin: 0 0 ${pxToRem(6)} 0;
  }

  .name {
    display: flex !important;
    align-items: center;
    width: 100%;

    .icon {
      margin-right: ${pxToRem(8)};
      flex: 0 0 ${pxToRem(16)};

      img {
        width: 100%;
        vertical-align: middle;
      }
    }
  }

  .chevron {
    padding: ${pxToRem(4)};
    display: flex;
    align-items: center;
    border: 0px;
    flex-shrink: 0;
    cursor: pointer;
    transition: all 0.3s ease-in-out 0s;
    font-size: ${(props) => pxToRem(props.theme.font.sizeXSmall)};
  }

  .nav-link {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    display: block;
    width: 100%;
    background: none;
    border: none;
    text-align: left;
    padding: ${pxToRem(12)} ${pxToRem(15)};
    font-size: 14px;
    display: block;
    text-decoration: none;
    cursor: pointer;
    color: #b8c7ce;
  }

  .active,
  .nav-link:hover {
    background: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.textLight};
  }

  .active {
    .chevron {
      transform: rotate(-90deg);
    }
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    ul {
      background: #43444a;

      .active,
      .nav-link:hover {
        background: ${(props) => props.theme.colors.primary};
      }

      .name {
        padding-right: 0;
        width: calc(100% - 50px);
        position: relative;

        .text {
          width: 100%;
        }
      }
    }
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
