import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

export default function TransitionsModal(props) {
  const { children, open, onClose, bigmodal, title, footer, isOuterStructure } =
    props;

  const useStyles = makeStyles((theme) => ({
    modal: {
      width: "100%",
      maxWidth: bigmodal ? "1000px" : "600px",
      margin: "30px auto",
      overflow: "hidden",
      height: "90%",
      position: "relative",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        height: "100%",
      },
    },
    head: {
      textAlign: "center",
      backgroundColor: "#eee",
      margin: 0,
      fontSize: 16,
      color: "#243a48",
      fontWeight: 700,
      padding: 8,
      "& h3": {
        margin: 0,
      },
    },
    body: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(1),
      overflow: "auto",
      maxHeight: "100%",
      paddingBottom: 40,
    },
    footer: {
      bottom: 0,
      left: 0,
      right: 0,
      top: "auto",
      padding: 15,
      textAlign: "center",
      borderTop: "1px solid #e5e5e5",
      backgroundColor: "#FFF",
    },
    footerOuter: {
      position: "absolute",
    },
    structureCarrier: {
      position: "static",
      borderRadius: 8,
      overflow: "auto",
      border: "1px solid rgba(0,0,0,.2)",
      maxHeight: "100%",
    },
    close: {
      cursor: "pointer",
    },
  }));

  const classes = useStyles();

  useEffect(() => {
    const position = () => {
      const bodyElem =
        document.querySelectorAll(
          '[class*="makeStyles-modal"] [class*="makeStyles-body"]'
        )[0] ||
        document.querySelectorAll(
          '[class*="makeStyles-modal"] [class*="body"]'
        )[0];

      const footElem =
        document.querySelectorAll(
          '[class*="makeStyles-modal"] [class*="makeStyles-footer"]'
        )[0] ||
        document.querySelectorAll(
          '[class*="makeStyles-modal"] [class*="footer"]'
        )[0];

      const headElem =
        document.querySelectorAll(
          '[class*="makeStyles-modal"] [class*="makeStyles-head"]'
        )[0] ||
        document.querySelectorAll(
          '[class*="makeStyles-modal"] [class*="head"]'
        )[0];

      const maxHeight =
        (90 * window.outerHeight) / 100 -
        (footElem?.scrollHeight || 0) -
        (headElem?.scrollHeight || 0);

      if (bodyElem?.scrollHeight) {
        if (bodyElem.scrollHeight > maxHeight) {
          bodyElem.style.paddingBottom = `${footElem?.scrollHeight + 40}px`;
          if (footElem) {
            footElem.style.position = "absolute";
          }
        } else {
          bodyElem.style.paddingBottom = `${40}px`;
          if (footElem) {
            footElem.style.position = "static";
          }
        }
      }
    };

    setTimeout(position);
  }, [open]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 700,
      }}
    >
      <Fade in={open}>
        <>
          {title && (
            <div className={classes.head}>
              <h3>{title}</h3>
            </div>
          )}

          {!isOuterStructure ? (
            <div className={classes.body}>{children}</div>
          ) : (
            <div className={classes.structureCarrier}>{children}</div>
          )}
          {footer && <div className={`${classes.footer}`}>{footer}</div>}
        </>
      </Fade>
    </Modal>
  );
}
