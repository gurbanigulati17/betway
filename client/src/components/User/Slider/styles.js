import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { hexToRgbA, pxToRem } from "../../../styles/utils";

const desktopStyle = css`
  margin: ${pxToRem(0)} ${pxToRem(0)} ${pxToRem(15)} ${pxToRem(0)};

  .slick-dots {
    li {
      button {
        width: ${pxToRem(80)};
        height: ${pxToRem(8)};
      }
    }
  }
`;

export default css`
  position: relative;
  z-index: 2;
  margin: 0;

  img {
    width: 100%;
  }

  .slick-dots {
    bottom: ${pxToRem(15)};

    li {
      margin: 0 ${pxToRem(2)};
      width: auto;
      height: auto;

      button {
        width: ${pxToRem(32)};
        height: ${pxToRem(6)};
        background: ${(props) => hexToRgbA(props.theme.colors.textLight, 0.6)};
        font-size: 0px;
        border: none;
        outline: none;
        padding: 0;

        &:before {
          content: none;
        }
      }

      &.slick-active {
        button {
          background: ${(props) => hexToRgbA(props.theme.colors.primary)};
        }
      }
    }
  }

  ${breakpoint("lg")`
    ${desktopStyle}
  `}
`;
