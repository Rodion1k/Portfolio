import React from 'react';
import {Button} from "react-bootstrap";
import './paginationToolBar.css';

const PaginationToolBar = (props) => {
    const {
        currentPage,
        setCurrentPage,
        maxPage,
    } = props;

    return (
        <div>
            <div className="pagination-toolbar">
                <Button variant="primary" className="pagination-button" disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
                <div className="pagination-toolbar-second-column">
                    <div className="page-word"> Page:</div>
                    <div className="pagination-toolbar__page-number">{currentPage}</div>
                    <div className="pagination-toolbar__page-number">/ {maxPage}</div>
                </div>
                <Button variant="primary" className="pagination-button" disabled={currentPage === maxPage}
                        onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
            </div>
        </div>
    );
};

export default PaginationToolBar;