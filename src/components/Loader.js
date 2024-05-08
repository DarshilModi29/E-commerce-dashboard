import React from 'react';

export default function Loader() {
    return (
        <div className="loader-container">
            <div className="loader-overlay"></div>
            <div className="loader-content">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" style={{ width: '3rem', height: '3rem' }} role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
