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
  background-color: #fff;
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
    font-size: 12px;
    padding: 8px;
    line-height: 1;
    color: #ffffff;
    margin: 0;
    font-weight: 700;
    background: linear-gradient(-180deg, #315195 0%, #14213d 100%);
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
    padding: ${pxToRem(3)} ${pxToRem(4)};
    display: flex;
    align-items: center;
    border: 0px;
    flex-shrink: 0;
    cursor: pointer;
    border: solid 1px #86af1d;
    color: #86af1d;
    font-size: 8px;
    font-weight: bold;
    border-radius: 3px;
  }

  .chevron svg {
    transition: all 0.3s ease-in-out 0s;
  }

  .nav-link {
    color: #223869;
    padding: 0.3rem 1rem;
    font-size: 13px;
    display: flex;
    text-decoration: none;
    background: 0 0;
    border: 0;
    border-bottom: 1px solid #d2d6e2;
    width: 100%;
    cursor: pointer;

    &:hover {
      background-color: #e6efd1;
      color: #1b2d52;

      .chevron {
        background-color: #83ae16;
        color: #fff;
      }
    }
  }

  .active {
    background-color: #e6efd1;
    color: #1b2d52;

    & > .chevron {
      background-color: #83ae16;
      color: #fff;
    }

    & > .chevron svg {
      transform: rotate(90deg);
    }
  }

  ul {
    padding: 0;
    margin: 0;
    list-style: none;

    ul {
      .name {
        padding-right: 0;
        width: calc(100% - 50px);
        position: relative;

        .text {
          width: 100%;
        }
      }

      .nav-link {
        padding-left: 2rem;
      }
    }
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
