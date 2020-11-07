import React, { useContext } from "react"
import ReactPaginate from "react-paginate"
import { CategoryManagerContext } from "./categoryManager/categoryManager"

import styles from "./pagination.module.css"

const Pagination = () => {
  const { pageCount, currentPage, changePage } = useContext(
    CategoryManagerContext
  )
  return (
    <div style={{ display: `flex`, justifyContent: `center` }}>
      <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        // breakLabel={"..."}
        // breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={1}
        // pageRangeDisplayed={3}
        containerClassName={`pagination ${styles.pagination}`}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
        previousLinkClassName={"page-link"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
        onPageChange={changePage}
        forcePage={currentPage}
      />
    </div>
  )
}

export default Pagination
