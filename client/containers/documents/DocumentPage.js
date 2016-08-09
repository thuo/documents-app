import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDocumentIfNeeded } from 'app/actions/DocumentActions';
import Document from 'app/components/documents/Document';
import AppError from 'app/components/error/AppError';
import EditDocument from './EditDocument';

export class DocumentPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
    };
    this.handleEditStart = this.handleEditStart.bind(this);
    this.handleEditStop = this.handleEditStop.bind(this);
  }

  componentDidMount() {
    this.props.fetchDocumentIfNeeded(this.props.params.documentId);
  }

  handleEditStart() {
    this.setState({
      isEditing: true,
    });
  }

  handleEditStop() {
    this.setState({
      isEditing: false,
    });
  }

  render() {
    const { doc, error, canEdit, canDelete } = this.props;
    if (!doc._id) {
      return <AppError>{(error && error.error) || 'Loading...'}</AppError>;
    }
    if (this.state.isEditing) {
      return (
        <EditDocument
          document={doc}
          onEditSuccess={this.handleEditStop}
          onCancel={this.handleEditStop}
        />
      );
    }
    return (
      <Document
        {...doc}
        onEditClick={this.handleEditStart}
        canEdit={canEdit}
        canDelete={canDelete}
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
  return {
    doc,
    error,
    canEdit: doc._id && state.authenticatedUser &&
      (doc.access.write === 'authenticated' ||
      doc.owner._id === state.authenticatedUser._id),
    canDelete: doc._id && state.authenticatedUser &&
      (doc.owner._id === state.authenticatedUser._id ||
      state.authenticatedUser.role === 'admin'),
  };
};

DocumentPage.propTypes = {
  doc: PropTypes.object,
  error: PropTypes.shape({
    error: PropTypes.string,
  }),
  fetchDocumentIfNeeded: PropTypes.func.isRequired,
  params: PropTypes.shape({
    documentId: PropTypes.string,
  }),
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default connect(
  mapStateToProps, {
    fetchDocumentIfNeeded,
  }
)(DocumentPage);
