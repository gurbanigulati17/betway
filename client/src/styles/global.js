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

  .btn-success {
    color: #fff;
    background-color: #5cb85c;
    border-color: #4cae4c
  }

  .btn-success.active,.btn-success:active,.btn-success:focus,.btn-success:hover,.open .dropdown-toggle.btn-success {
    color: #fff;
    background-color: #47a447;
    border-color: #398439;
  }

  .btn-success.active,.btn-success:active,.open .dropdown-toggle.btn-success {
    background-image: none;
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

  .btn-primary-transparent {
    border: 1px solid #0b1933;
    background: transparent;
    box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 40%);
  }

  .btn-success.hover,.btn-success:active,.btn-success:hover {
    background-color: #008d4c;
  }

  .btn-info {
    color: #fff;
    background-color: #00c0ef;
    border-color: #00acd6;
  }

  .btn-info.hover,.btn-info:active,.btn-info:hover {
    background-color: #00acd6;
  }

  .btn-danger {
    color: #fff;
    background-color: #dd4b39;
    border-color: #d73925;
  }

  .btn-danger.hover,.btn-danger:active,.btn-danger:hover {
    background-color: #d73925;
  }

  .btn-warning {
    background-color: #4a4a4a;
    border-color: #4a4a4a;
  }

  .btn-warning.hover,.btn-warning:active,.btn-warning:hover {
    background-color: #4a4a4a;
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
      color: #fff;
      padding: 10px;
      background-color: #4a4a4a;
    }

    .head h3 {
      margin: 0;
    }

    .body {
      padding: 8px;
      overflow: auto;
      box-shadow: 0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12);
      max-height: 100%;
      padding-bottom: 120px;
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
      text-align: right;
      background-color: #FFF;
    }
  }
`;

export default GlobalStyle;
