import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Icon, Pagination } from "semantic-ui-react";

export default function Paginations(props) {
  return (
    <Grid centered columns={3}>
      <Grid.Column>
        <div className="pagination">
          <Pagination
            defaultActivePage={1}
            ellipsisItem={{
              content: <Icon name="ellipsis horizontal" />,
              icon: true,
            }}
            firstItem={{
              content: <Icon name="angle double left" />,
              icon: true,
            }}
            lastItem={{
              content: <Icon name="angle double right" />,
              icon: true,
            }}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
            onPageChange={(e, data) => {
              props.handlePages(e, data.activePage);
            }}
            totalPages={props.state.pageCount}
          />
        </div>
      </Grid.Column>
    </Grid>
  );
}
