import React, { PropTypes } from 'react';

const Dialog = props => {
  const { className, children, open } = props;
  let classes = 'mdl-dialog__container';
  if (className) {
    classes = `${classes} className`;
  }
  if (open) {
    classes = `${classes} visible`;
  }
  return (
    <div className={classes}>
      <div className="mdl-dialog">
        {children}
      </div>
    </div>
  );
};

Dialog.propTypes = {
  className: PropTypes.string,
  open: PropTypes.bool,
  children: PropTypes.node,
};

export default Dialog;
