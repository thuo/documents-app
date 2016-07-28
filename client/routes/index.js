import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'app/components/App';
import DocumentList from 'app/containers/DocumentList';
import NotFound from 'app/components/NotFound';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={DocumentList} />
    <Route path="*" component={NotFound} />
  </Route>
);
