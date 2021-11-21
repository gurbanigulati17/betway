import React, { useState } from "react";

import Modal from "../../UI/Modal/Modal";

import classes from "./style.module.css";

const content = [
  {
    title: "Privacy Policy",
    Component: () => null,
    type: "privacy",
  },
  {
    title: "KYC",
    Component: () => null,
    type: "kyc",
  },
  {
    title: "Terms and Conditions",
    Component: () => null,
    type: "terms",
  },
  {
    title: "Rules and Regulations",
    Component: () => null,
    type: "rules",
  },
  {
    title: "Responsible Gambling",
    Component: () => null,
    type: "responsible",
  },
];

const Footer = () => {
  const [ActiveContent, setContent] = useState(null);

  const onClose = () => setContent(null);

  return (
    <>
      <footer class={classes.footer}>
        <div class={classes.whatsapp}>
          <h3>Support</h3>
          <a href="https://api.whatsapp.com/send?phone=44 1492 498050">
            <i className="fab fa-whatsapp"></i>
            <span>WhatsApp +44 1492 498050</span>
          </a>
        </div>
        <div class={classes.helpLinks}>
          <ul>
            {content.map((item, index) => (
              <li key={index}>
                <a onClick={() => setContent(item)}>{item.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
      {ActiveContent && (
        <Modal
          title={ActiveContent.title}
          open
          onClose={onClose}
          footer={
            <button className="btn btn-primary btn-extra" onClick={onClose}>
              OK
            </button>
          }
        >
          <ActiveContent.Component />
        </Modal>
      )}
    </>
  );
};

export default Footer;
