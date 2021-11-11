import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

export default function TransitionsModal(props) {
  const { children, open, onClose, bigmodal, title, footer, isOuterStructure } =
    props;

  console.log(isOuterStructure);

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
      padding: 10,
      backgroundColor: "#4a4a4a",
      color: "#fff",
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
      paddingBottom: 120,
    },
    footer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      top: "auto",
      padding: 15,
      textAlign: "right",
      borderTop: "1px solid #e5e5e5",
      backgroundColor: "#FFF",
    },
    structureCarrier: {
      position: "relative",
    },
  }));

  const classes = useStyles();

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
          {footer && <div className={classes.footer}>{footer}</div>}
        </>
      </Fade>
    </Modal>
  );
}
