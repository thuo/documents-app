import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'react-mdl';
import { push } from 'react-router-redux';
import {
  fetchDocumentIfNeeded, deleteDocument,
} from 'app/actions/DocumentActions';
import Document from 'app/components/documents/Document';
import AppError from 'app/components/error/AppError';

export class DocumentPage extends React.Component {

  constructor(props) {
    super(props);
    this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
  }

  componentDidMount() {
    this.props.fetchDocumentIfNeeded(this.props.params.documentId);
  }

  handleDeleteSuccess() {
    this.props.pushToHistory('/');
  }

  render() {
    const { doc, error, loading } = this.props;
    if (error || loading || !doc) {
      return <AppError>{error || <Spinner />}</AppError>;
    }
    return (
      <Document
        doc={doc}
        onDeleteSuccess={this.handleDeleteSuccess}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { entities, documentPage } = state;
  const { params: { documentId } } = ownProps;

  let doc = null;
  if (entities.documents[documentId]) {
    doc = Object.assign({}, entities.documents[documentId]);
    doc.owner = entities.users[doc.owner];
  }
  const { loading } = documentPage;
  const error = documentPage.error && documentPage.error.error;
  return {
    doc,
    error,
    loading,
  };
};

DocumentPage.propTypes = {
  doc: PropTypes.object,
  error: PropTypes.string,
  loading: PropTypes.bool,
  fetchDocumentIfNeeded: PropTypes.func.isRequired,
  pushToHistory: PropTypes.func.isRequired,
  params: PropTypes.shape({
    documentId: PropTypes.string,
  }),
};

export default connect(
  mapStateToProps, {
    fetchDocumentIfNeeded,
    deleteDocument,
    pushToHistory: push,
  }
)(DocumentPage);
