import React, { Component } from "react";
import LeftSection from "./Left/Left";
import RightSection from "./Right/Right";

class Series extends Component {
  render() {
    return (
      <div>
        <LeftSection />
        <RightSection />
      </div>
    );
  }
}

export default Series;
