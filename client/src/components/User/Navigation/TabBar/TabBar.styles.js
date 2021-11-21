import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { pxToRem, hexToRgbA } from "../../../../styles/utils";

const desktopStyle = css``;

export default css`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      position: relative;
    }

    .nav-link {
      position: relative;
      border: 0;
      border-bottom: 1px solid #c8ced3;
      display: block;
      width: 100%;
      clear: both;
      font-weight: 400;
      color: #23282c;
      text-align: inherit;
      white-space: nowrap;
      background-color: transparent;
      padding: 5px 10px;
      line-height: 1;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        color: #181b1e;
        text-decoration: none;
        background-color: #f0f3f5;
      }
    }

    ul {
      .nav-link {
        padding-left: 20px;
      }
    }

    .icon {
      margin-left: ${pxToRem(8)};
    }

    .chevron-b {
      margin-left: ${pxToRem(8)};
    }

    .logout {
      padding: 5px 10px;

      button {
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        width: 100%;
        padding: 7px 10px 5px;
        font-weight: 700;
        background-color: #7e97a7;
        line-height: 1;
        font-size: 13px;
        cursor: pointer;
        border-color: unset;
        background: linear-gradient(180deg, #2a3a43 27%, #1c282d 83%);
        color: #fff;
        border: 1px solid transparent;
        border-radius: 0.25rem;
      }
    }
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
