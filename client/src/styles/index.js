import styled from "styled-components";

const withStyles = (WrappedComponent, styles) => styled(WrappedComponent)`
  ${styles}
`;

export default withStyles;
