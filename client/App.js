import React from 'react';
import Document from 'app/Document';
import request from 'superagent';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      error: null,
    };
  }

  componentDidMount() {
    this.request = request.get('/api/documents').then(
      response => {
        this.setState({
          documents: response.body,
        });
      },
      error => {
        this.setState({
          error: error.response.body.error,
        });
      }
    );
  }

  componentWillUnmount() {
    this.request.abort();
  }

  render() {
    return (
      <div>
        {this.state.documents.map(doc =>
          <Document {...doc} key={doc._id} />
        )}
      </div>
    );
  }
}
