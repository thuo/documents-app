import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'react-mdl';
import { push } from 'react-router-redux';
import {
  fetchDocumentIfNeeded, deleteDocument,
} from 'app/actions/DocumentActions';
import Document from 'app/components/documents/Document';
import AppError from 'app/components/error/AppError';
import checkDocumentAccess from 'app/utils/checkDocumentAccess';

export class DocumentPage extends React.Component {

  constructor(props) {
    super(props);
    this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this);
  }

  componentDidMount() {
    this.props.fetchDocumentIfNeeded(this.props.params.documentId);
  }

  componentWillReceiveProps(nextProps) {
    const { params: { documentId } } = this.props;
    const { params: { documentId: nextDocumentId } } = nextProps;
    if (documentId !== nextDocumentId) {
      this.props.fetchDocumentIfNeeded(nextDocumentId);
    }
  }

  handleDeleteSuccess() {
    this.props.pushToHistory('/');
  }

  render() {
    const { doc, error } = this.props;
    if (doc) {
      return (
        <Document
          doc={doc}
          onDeleteSuccess={this.handleDeleteSuccess}
        />
      );
    }
    return <AppError>{error || <Spinner />}</AppError>;
  }
}

export const mapStateToProps = (state, ownProps) => {
  const { entities, documentPage, authenticatedUser } = state;
  const { params: { documentId } } = ownProps;

  let error = documentPage.error && documentPage.error.error;
  let doc = null;
  if (entities.documents[documentId]) {
    doc = Object.assign({}, entities.documents[documentId]);
    doc.owner = entities.users[doc.owner];
  }
  if (doc && !checkDocumentAccess(authenticatedUser)(doc)) {
    error = 'Access Denied';
    doc = null;
  }
  const { loading } = documentPage;
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
