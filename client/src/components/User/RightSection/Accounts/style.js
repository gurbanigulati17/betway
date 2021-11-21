import { css } from "styled-components";

export default css`
  .username {
    background-image: linear-gradient(-180deg, #2e4b5e 0%, #243a48 82%);
    color: #fff;
    font-size: 16px;
    line-height: 1;
    padding: 8px;
  }

  ul {
    li {
      .nav-link {
        text-decoration: none;
        color: #2789ce;
        outline: 0;
        -webkit-tap-highlight-color: rgba(182, 223, 253, 0.5);
        flex: 1;
        position: relative;
        font-size: 16px;
        font-weight: 700;
        line-height: 1.6;
        padding: 9px 11px;
        flex-wrap: wrap;
        background: #fff;
        display: flex;
        justify-content: space-between;
      }

      .chevron-b {
        margin: 0;
        padding: 3px;
        line-height: 1;
        border: 1px solid #e0e6e6;
        border-radius: 3px;

        svg {
          transform: rotate(-90deg);
        }
      }

      &.active {
        .chevron-b {
          svg {
            transform: rotate(0);
          }
        }
      }

      &.logout {
        button {
          margin-top: 10px;
          background: linear-gradient(-180deg, #e93522 0, #be2414 100%);
          padding: 15px;
          font-size: 16px;
        }
      }
    }

    ul {
      .nav-link {
        padding-left: 20px;
      }
    }
  }
`;
