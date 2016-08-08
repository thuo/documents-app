import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDocumentIfNeeded } from 'app/actions/DocumentActions';
import Document from 'app/components/documents/Document';
import AppError from 'app/components/error/AppError';

export class DocumentList extends React.Component {

  componentDidMount() {
    this.props.fetchDocumentIfNeeded(this.props.params.documentId);
  }

  render() {
    const { doc, error } = this.props;
    if (!doc._id) {
      return <AppError>{(error && error.error) || 'Loading...'}</AppError>;
    }
    return (
      <Document
        {...doc}
        key={doc._id}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { entities, documentPage } = state;
  const { params: { documentId } } = ownProps;
  const doc = Object.assign({}, entities.documents[documentId]);
  doc.owner = entities.users[doc.owner];
  const error = documentPage.error;
  return { doc, error };
};

DocumentList.propTypes = {
  doc: PropTypes.object,
  error: PropTypes.shape({
    error: PropTypes.string,
  }),
  fetchDocumentIfNeeded: PropTypes.func.isRequired,
  params: PropTypes.shape({
    documentId: PropTypes.string,
  }),
};

export default connect(
  mapStateToProps, {
    fetchDocumentIfNeeded,
  }
)(DocumentList);
