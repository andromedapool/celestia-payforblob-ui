import React from "react";

type ModalProps = {
  isActive: boolean;
  title: string;
  onCancel: Function;
};

const Modal = (props: React.PropsWithChildren<ModalProps>): React.ReactElement => {
  return (
    <React.Fragment>
      <div className={`modal modal-wrapper ${props.isActive && "is-active"}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{props.title}</p>
            <button type="button" className="delete" aria-label="close" onClick={() => props.onCancel()}></button>
          </header>
          <section className="modal-card-body">{props.children}</section>
        </div>
      </div>
    </React.Fragment>
  );
};

export { Modal };
