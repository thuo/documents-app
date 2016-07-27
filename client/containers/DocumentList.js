import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDocuments } from 'app/actions';
import Document from 'app/components/Document';

export class DocumentList extends React.Component {
  componentDidMount() {
    this.props.fetchDocuments();
  }

  render() {
    if (this.props.error) {
      return (
        <h2
          style={{ textAlign: 'center', maxWidth: '892px', margin: '2em auto' }}
        >
          {this.props.error}
        </h2>
      );
    }
    return (
      <div>
        {this.props.documents.map(doc =>
          <Document {...doc} key={doc._id} />
        )}
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  documents: state.documents,
  error: state.error.error,
});

export const mapDispatchToProps = dispatch => ({
  fetchDocuments: () => dispatch(fetchDocuments()),
});

DocumentList.propTypes = {
  documents: PropTypes.array,
  error: PropTypes.string,
  fetchDocuments: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentList);
