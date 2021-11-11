import { css } from "styled-components";
import breakpoint from "styled-components-breakpoint";
import { hexToRgbA, pxToRem } from "../../../../styles/utils";

const desktopStyle = css`
  z-index: 120;

  .site-header-wrapper {
    display: flex;
    align-items: center;
  }

  .logo {
    width: ${pxToRem(240)};
  }

  .message {
    padding: ${pxToRem(10)} ${pxToRem(25)};
    background-color: ${(props) => hexToRgbA(props.theme.colors.primary)};
    width: 75%;
    margin-top: 0;

    a {
      display: none;
    }
  }

  .logo {
    text-align: center;
    width: ${pxToRem(240)};
    padding: 0;
  }

  .flyout-nav {
    padding-top: ${pxToRem(60)};
  }

  .nav-wrapper {
    display: flex;
    width: calc(100% - ${pxToRem(240)});
    justify-content: space-between;
    align-items: center;
  }

  .menu-panel {
    display: flex;
    order: 2;
  }

  .main-memu {
    position: relative;
    bottom: 0;
  }
`;

export default css`
  position: sticky;
  width: 100%;
  z-index: 20;
  top: 0;
  left: 0;
  font-size: ${pxToRem(14)};
  top: 0;

  .site-header-wrapper {
    background: linear-gradient(
      to right,
      ${(props) => props.theme.colors.primaryDark},
      ${(props) => props.theme.colors.primary},
      ${(props) => props.theme.colors.primaryDark}
    );
    color: ${(props) => props.theme.colors.textLight};
    padding: 0;
    min-height: ${pxToRem(60)};
    position: relative;
    z-index: 10;
  }

  .logo {
    text-align: center;
    width: 100%;
    padding: ${pxToRem(5)} 0;

    a,
    img {
      display: block;
      margin: 0 auto;
    }
  }

  .main-menu-trigger {
    padding: 20px;
    margin: 0;
    background: none;
    border: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    color: #fff;
    z-index: 2;
  }

  .main-memu {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    position: absolute;
    right: 0;
    left: auto;
    top: auto;
    bottom: 0px;
    bottom: -6px;
    outline: none;
  }

  .account-summary {
    display: flex;
  }

  .username {
    text-align: center;
    padding: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #b8c7ce;
  }

  .flyout-nav {
    background: #53555b;
    color: ${(props) => props.theme.colors.textLight};
    position: fixed;
    overflow: auto;
    z-index: 5;
    transition: all 0.25s ease 0s;
    width: ${pxToRem(230)};
    right: -230px;
    top: 0;
    bottom: 0;
    left: auto;
    padding-top: ${pxToRem(105)};

    &.show {
      right: 0;
    }
  }

  .account-summary {
    padding: 0;
    margin: 0;
    align-items: center;
    list-style: none;
    justify-content: center;

    li {
      margin: 0 15px;
    }
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

  .message {
    padding: ${pxToRem(10)} ${pxToRem(40)};
    background-color: #343131;
    font-size: ${pxToRem(14)};
    position: relative;
    width: 100%;
    margin-top: 5px;

    a {
      position: absolute;
      left: 0;
      padding: ${pxToRem(2)} ${pxToRem(10)};
      top: 0;
      font-size: ${pxToRem(25)};
      color: ${(props) => props.theme.colors.textLight};
      background-color: ${(props) => hexToRgbA(props.theme.colors.text)};
      display: block;
      z-index: 2;
    }

    marquee {
      display: block;
    }
  }

  ${breakpoint("md")`
    ${desktopStyle}
  `}
`;
