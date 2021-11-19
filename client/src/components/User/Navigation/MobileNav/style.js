import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";

const desktopStyle = css`
  display: none;
`;

export default css`
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: linear-gradient(-180deg, #243a48 20%, #172732 91%);
  color: #fff;

  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;

    li {
      width: 20%;

      &:nth-child(3) {
        &:before {
          content: "";
        }
      }
    }

    a {
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 16px;
      text-align: center;
      line-height: 1.1;
      padding: 8px;
      display: block;
      text-decoration: none;

      &.active {
        background-image: linear-gradient(-180deg, #32617f 20%, #1f4258 91%);
      }
    }

    span {
      display: block;
      margin-top: 5px;
    }

    svg {
      font-size: 22px;
    }
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
