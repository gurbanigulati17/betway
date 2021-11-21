import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { pxToRem } from "../../../../styles/utils";

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

  &.secondary {
    padding: 0;
    background: linear-gradient(#f60105 0, #801011 100%);
    overflow: visible;

    .logout {
      display: none !important;
    }

    & > ul {
      display: flex;

      & > li {
        position: relative;

        & > .nav-link {
          font-size: 13px;
          padding: 10px;
          display: flex;
          border: 0;
          border-right: 1px solid #797777;
          list-style: none;
          color: #fff;
          font-weight: bold;
          align-items: center;

          &:hover {
            color: #fff;
            background-color: transparent;
          }
        }

        .active {
          color: #fff;
          background-color: transparent;
        }

        .chevron {
          margin-left: 10px;
          border: 0;
          padding: 0;
          font-size: 13px;
          font-weight: bold;
          color: #fff;
          background: none;

          &:hover {
            background: none;
          }

          svg {
            transform: rotate(90deg);
          }
        }

        &.active > ul {
          display: block;
          min-width: 200px;
          border: solid 1px #ccc;
          border-bottom: 0;
        }
      }

      ul {
        display: none;
        position: absolute;
        z-index: 10;
        opacity: 1;
        background: #fff;
        max-height: 400px;
        overflow: auto;

        .nav-link {
          padding: 10px;
        }
      }
    }
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
