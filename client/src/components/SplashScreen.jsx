import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BetSpinner from "./UI/Spinner/BetSpinner";

export const SplashScreen = ({ children }) => {
  const open = useSelector((state) => state.auth.loading);
  const [splashScreen, setSplashScreen] = useState(open);

  useEffect(() => {
    setSplashScreen(open);
  }, [open]);

  return (
    <div className="page-wrapper">
      {splashScreen ? <BetSpinner /> : children}
    </div>
  );
};

export default SplashScreen;
