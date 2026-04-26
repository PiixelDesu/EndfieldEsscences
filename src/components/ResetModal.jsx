import React from 'react';

const ResetModal = ({ showResetModal, closeModals, confirmReset }) => {
    if (!showResetModal) return null;

    return (
        <div className="custom-modal-overlay">
            <div className="custom-modal" style={{maxWidth: '400px'}}>
                <h4 className="mb-3">Reset Priorities</h4>
                <p style={{ color: '#fff', fontSize: '1rem' }}>Reset all weapons back to default priority?</p>
                <div className="modal-buttons">
                    <button className="modal-btn btn-confirm" onClick={confirmReset}>RESET</button>
                    <button className="modal-btn btn-cancel" onClick={closeModals}>CANCEL</button>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ResetModal);