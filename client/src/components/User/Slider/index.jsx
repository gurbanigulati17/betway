import React from "react";
import SlickSlider from "react-slick";
import classnames from "classnames";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./styles";

import withStyles from "../../../styles";

import slide1 from "../../../assets/slides/slide1.jpeg";
import slide2 from "../../../assets/slides/slide2.jpeg";
import slide3 from "../../../assets/slides/slide3.jpeg";
import slide4 from "../../../assets/slides/slide4.jpeg";
import slide5 from "../../../assets/slides/slide5.jpeg";

const Slider = ({ className }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
  };

  const slides = [slide1, slide2, slide3, slide4, slide5];

  return (
    <div className={classnames("app-slider", className)}>
      <SlickSlider {...settings}>
        {slides.map((item, index) => (
          <img src={item} alt={`Slide ${index + 1}`} />
        ))}
      </SlickSlider>
    </div>
  );
};

export default withStyles(Slider, styles);
