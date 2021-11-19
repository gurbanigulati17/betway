import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { hexToRgbA, pxToRem } from "../../../../styles/utils";

const desktopStyle = css`
  z-index: 120;

  .site-header-wrapper {
    min-height: ${pxToRem(60)};
    padding: 0;
  }

  .logo {
    width: ${pxToRem(240)};
  }

  .logo {
    text-align: center;
    width: ${pxToRem(240)};
    padding: 0;
  }

  .nav-wrapper {
    display: flex;
    width: calc(100% - ${pxToRem(240)});
    justify-content: flex-end;
    align-items: center;
  }

  .menu-panel {
    display: flex;
    order: 2;
    padding-right: 20px;
  }

  .main-memu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: relative;
  }

  .betBtn {
    display: none;
  }

  .account-summary {
    flex-direction: row;
    align-items: center;

    li {
      margin: 0 15px;
    }
  }

  .site-header-bottom {
    display: block;
  }
`;

export default css`
  position: sticky;
  width: 100%;
  z-index: 20;
  top: 0;
  left: 0;
  top: 0;

  .site-header-wrapper {
    display: flex;
    align-items: center;
    background: linear-gradient(
      -180deg,
      ${(props) => props.theme.colors.primary} 0%,
      ${(props) => props.theme.colors.primaryDark} 100%
    );
    color: ${(props) => props.theme.colors.textLight};
    padding: 8px 10px;
    position: relative;
    z-index: 10;
    justify-content: space-between;
  }

  .logo {
    text-align: center;
    padding: ${pxToRem(5)} 0;

    a,
    img {
      display: block;
      margin: 0 auto;
    }
  }

  .main-menu-trigger {
    color: #fff;
    display: flex;
    align-items: center;
    border-radius: 3px;

    span {
      margin: 0 5px;
    }
  }

  .main-memu {
    display: none;
  }

  .username {
    border-bottom: 1px solid #333;
    padding: 5px 10px;
    display: block;
    margin-bottom: 0;
    font-size: 0.765625rem;
    color: #333;
    white-space: nowrap;
    font-weight: bold;
    background-color: #e4e7ea;
  }

  .flyout-nav {
    position: absolute;
    top: 46px;
    z-index: 1000;
    width: 230px;
    padding: 0;
    margin: 0.125rem 0 0;
    font-size: 0.875rem;
    color: #23282c;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #c8ced3;
    border-radius: 0.25rem;
    right: 20px;
    transform: translateY(20px);
    opacity: 0;
    visibility: hidden;
    transition: 0.25s ease all;

    &.show {
      transform: translateY(0px);
      opacity: 1;
      visibility: visible;
    }
  }

  .account-summary {
    padding: 0;
    margin: 0;
    align-items: end;
    list-style: none;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }

  .navigations {
    padding: 0;
    margin: 0;

    li {
      padding: ${pxToRem(10)} ${pxToRem(14)};
      display: flex;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid
        ${(props) => hexToRgbA(props.theme.borders.grey, 0.15)};
      position: relative;

      &:after {
        content: "";
        position: absolute;
        height: 100%;
        width: ${pxToRem(2)};
        background-color: transparent;
        left: 0;
      }

      &:hover {
        background-color: ${(props) =>
          hexToRgbA(props.theme.borders.grey, 0.15)};

        &:after {
          background-color: ${(props) =>
            hexToRgbA(props.theme.colors.primary, 0.75)};
        }
      }

      img {
        width: ${pxToRem(16)};
        margin-right: ${pxToRem(6)};
        vertical-align: middle;
      }

      a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${(props) => props.theme.colors.text};
        text-decoration: none;
      }
    }
  }

  .site-header-bottom {
    display: none;
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
