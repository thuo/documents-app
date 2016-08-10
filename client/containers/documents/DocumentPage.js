import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Button, Dialog, DialogContent, DialogActions } from 'react-mdl';
import {
  fetchDocumentIfNeeded, deleteDocument,
} from 'app/actions/DocumentActions';
import Document from 'app/components/documents/Document';
import AppError from 'app/components/error/AppError';
import EditDocument from './EditDocument';

export class DocumentPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      openDeleteDialog: false,
    };
    this.handleEditStart = this.handleEditStart.bind(this);
    this.handleEditStop = this.handleEditStop.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleOpenDeleteDialog = this.handleOpenDeleteDialog.bind(this);
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
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

  handleDelete() {
    this.props.deleteDocument(this.props.doc._id).then(() => {
      this.props.pushToHistory('/');
    });
  }

  handleOpenDeleteDialog() {
    this.setState({
      openDeleteDialog: true,
    });
  }

  handleCloseDeleteDialog() {
    this.setState({
      openDeleteDialog: false,
    });
  }


  render() {
    const { doc, error, canEdit, canDelete } = this.props;
    if (!doc) {
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
      <div>
        <Document
          {...doc}
          onEditClick={this.handleEditStart}
          onDeleteClick={this.handleOpenDeleteDialog}
          canEdit={canEdit}
          canDelete={canDelete}
        />
        <Dialog open={this.state.openDeleteDialog}>
          <DialogContent>
            Delete the document <strong>{doc.title}</strong>
          </DialogContent>
          <DialogActions>
            <Button colored onClick={this.handleDelete}>
              Delete
            </Button>
            <Button colored onClick={this.handleCloseDeleteDialog}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
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

  const error = documentPage.error;

  const canEdit = doc && state.authenticatedUser &&
    (doc.access.write === 'authenticated' ||
    doc.owner._id === state.authenticatedUser._id);

  const canDelete = doc && state.authenticatedUser &&
    (doc.owner._id === state.authenticatedUser._id ||
    state.authenticatedUser.role === 'admin');

  return {
    doc,
    error,
    canEdit,
    canDelete,
  };
};

DocumentPage.propTypes = {
  doc: PropTypes.object,
  error: PropTypes.shape({
    error: PropTypes.string,
  }),
  fetchDocumentIfNeeded: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  pushToHistory: PropTypes.func.isRequired,
  params: PropTypes.shape({
    documentId: PropTypes.string,
  }),
  canEdit: PropTypes.bool,
  canDelete: PropTypes.bool,
};

export default connect(
  mapStateToProps, {
    fetchDocumentIfNeeded,
    deleteDocument,
    pushToHistory: push,
  }
)(DocumentPage);
