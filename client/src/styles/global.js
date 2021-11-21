// globalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${(props) => props.theme.font.family};
    font-size: ${(props) => props.theme.body.size}px;
    background-color: ${(props) => props.theme.body.bg};
    line-height: 1.45;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
  }

  body,
  html,
  #root,
  .page-wrapper {
    height: 100%;
  }

  img {
    max-width: 100%;
    vertical-align: middle;
  }
  
  button {
    font-family: ${(props) => props.theme.font.family};
  }

  .btn {
    display: inline-block;
    padding: 6px 12px; 
    margin-bottom: 0;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.25;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    user-select: none;
    border-radius: 0;
    font-family: ${(props) => props.theme.font.family};
    box-shadow: none;
    letter-spacing: 0;
    text-transform:none;
    min-width: 1px;
    border: 0;
    border-radius: 3px;
    color: #FFF;
  }

  .btn-primary {
    background: #646f87; /* Old browsers */
    background: -moz-linear-gradient(top,  #646f87 0%, #96a0b9 1%, #9aa5c0 2%, #4c5f8f 6%, #44588a 7%, #3d4d77 97%, #394971 98%, #212f4e 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top,  #646f87 0%,#96a0b9 1%,#9aa5c0 2%,#4c5f8f 6%,#44588a 7%,#3d4d77 97%,#394971 98%,#212f4e 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom,  #646f87 0%,#96a0b9 1%,#9aa5c0 2%,#4c5f8f 6%,#44588a 7%,#3d4d77 97%,#394971 98%,#212f4e 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#646f87', endColorstr='#212f4e',GradientType=0 ); /* IE6-9 */
    border: solid 1px #0a1933;
    color: #FFF;
  }

  .btn-secondary {
    margin: 0 auto;
    border: 1px solid #bbb;
    border-radius: 4px;
    color: #1e1e1e;
    font-weight: 700;
    text-align: center;
  }

  .btn-extra {
    padding-left: 50px;
    padding-right: 50px;
    font-weight: bold;
  }

  .btn-primary-transparent {
    border: 1px solid #0b1933;
    background: transparent;
    box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 40%);
  }

  [class*="makeStyles-paper"] [class*="makeStyles-paper"] {
    padding: 0;
    margin: 0;
    box-shadow: none;
  }

  [class*="BetSpinner_loader"] + [class*="BetSpinner_loader"] {
    display: none;
  }

  [class*="makeStyles-modal"] {
    .head {
      color: #243a48;
      padding: 10px;
      background-color: #eee;
      font-size: 16px;
      text-align: center;
    }

    .head h3 {
      margin: 0;
    }

    .body {
      padding: 20px;
      overflow: auto;
      box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12);
      max-height: 100%;
      padding-bottom: 40px;
      background-color: #fff;
    }

    .footer {
      top: auto;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 15px;
      position: absolute;
      border-top: 1px solid #e5e5e5;
      text-align: center;
      background-color: #FFF;
    }
  }

  .formInputTheme,
  .formInputWrapper input {
    width: auto !important;
    min-width: 250px;
    outline: 0 !important;
    background-color: #FFF !important;
    overflow: hidden;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
    padding: 8px !important;
    border: none !important;
    color: #555 !important;
    border-radius: 4px !important;
    border: 1px solid #CCC !important;
    font-size: 14px;
    height: auto !important;
    box-sizing: border-box !important;
    letter-spacing:0 !important;
    margin-bottom: 15px !important;
  }

  .formInputWrapper .MuiInput-formControl {
    &:after,
    &:before {
      content: none;
    }
  }

  @media screen and (max-width: 767px){
    .formInputTheme,
    .formInputWrapper input{
      width: 100% !important;
    }

    [class*="makeStyles-modal-"] {
      width: 90% !important;
      height: 90% !important;
      margin: 0 auto;
      max-width: 100%;
      margin-top: 5% !important;
      border-radius: 8px !important;
    }
  }
`;

export default GlobalStyle;
