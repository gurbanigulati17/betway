import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { pxToRem, hexToRgbA } from "../../../../styles/utils";

const desktopStyle = css``;

export default css`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    background: #53555b;

    li {
      position: relative;

      &:hover,
      &.active {
        background-color: ${(props) => props.theme.colors.primary};
      }

      ul {
        padding-left: ${pxToRem(40)};
        background-color: ${(props) => props.theme.colors.primary};

        .icon {
          width: auto;
          height: auto;
          background: transparent;
        }
      }
    }

    .nav-link {
      padding: ${pxToRem(10)} ${pxToRem(15)};
      font-size: ${(props) => pxToRem(props.theme.font.sizeL)};
      text-decoration: none;
      background: none;
      border: 0;
      cursor: pointer;
      color: ${(props) => props.theme.colors.textLight};
      display: flex;
      align-items: center;
      white-space: nowrap;
      width: 100%;
    }

    .icon {
      width: ${pxToRem(35)};
      height: ${pxToRem(35)};
      border-radius: 50%;
      text-align: center;
      line-height: ${pxToRem(35)};
      background-color: ${(props) => props.theme.colors.primary};
      margin-right: ${pxToRem(8)};
    }

    .chevron-b {
      margin-left: ${pxToRem(5)};
    }
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
