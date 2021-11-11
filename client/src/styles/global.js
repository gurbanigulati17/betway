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
    display: inline-block !important;
    padding: 6px 12px !important; 
    margin-bottom: 0 !important;
    font-size: 14px !important;
    font-weight: 400 !important;
    line-height: 1.425 !important;
    text-align: center !important;
    white-space: nowrap !important;
    vertical-align: middle !important;
    touch-action: manipulation !important;
    cursor: pointer !important;
    user-select: none !important;
    border-radius: 0 !important;
    font-family: ${(props) => props.theme.font.family} !important;
    box-shadow: none;
    letter-spacing: 0 !important;
    text-transform:none !important;
    min-width: 1px !important;
    border: 0 !important;
  }

  .btn-success {
    color: #fff!important;
    background-color: #5cb85c!important;
    border-color: #4cae4c!important
  }

  .btn-success.active,.btn-success:active,.btn-success:focus,.btn-success:hover,.open .dropdown-toggle.btn-success {
    color: #fff!important;
    background-color: #47a447!important;
    border-color: #398439!important;
  }

  .btn-success.active,.btn-success:active,.open .dropdown-toggle.btn-success {
    background-image: none !important;
  }

  .btn-primary {
    background-color: #4a4a4a !important;
    border-color: #367fa9 !important;
  }

  .btn-primary.hover,.btn-primary:active,.btn-primary:hover {
    background-color: #367fa9 !important;
  }

  .btn-success.hover,.btn-success:active,.btn-success:hover {
    background-color: #008d4c !important;
  }

  .btn-info {
    color: #fff!important;
    background-color: #00c0ef !important;
    border-color: #00acd6 !important;
  }

  .btn-info.hover,.btn-info:active,.btn-info:hover {
    background-color: #00acd6 !important;
  }

  .btn-danger {
    color: #fff!important;
    background-color: #dd4b39 !important;
    border-color: #d73925 !important;
  }

  .btn-danger.hover,.btn-danger:active,.btn-danger:hover {
    background-color: #d73925 !important;
  }

  .btn-warning {
    background-color: #4a4a4a !important;
    border-color: #4a4a4a !important;
  }

  .btn-warning.hover,.btn-warning:active,.btn-warning:hover {
    background-color: #4a4a4a !important;
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
