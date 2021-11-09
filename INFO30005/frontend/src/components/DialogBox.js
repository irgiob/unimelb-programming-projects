import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// frequently used template for a popup box using material-ui

function DialogBox(props) {
    const { onClose, open, fullScreen } = props;

    return (
        <Dialog
            fullScreen={fullScreen}
            fullWidth
            TransitionComponent={Transition}
            maxWidth='xs'
            onClose={onClose}
            aria-labelledby="simple-dialog-title"
            open={open}>
            {props.children}
        </Dialog>
    );
}

DialogBox.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default DialogBox;