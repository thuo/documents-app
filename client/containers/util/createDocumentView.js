import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, DialogContent, DialogActions } from 'react-mdl';
import Dialog from 'app/components/util/Dialog';
import { deleteDocument } from 'app/actions/DocumentActions';
import EditDocument from 'app/containers/documents/EditDocument';
import omit from 'lodash/omit';

export const createDocumentView = Component => {
  class DocumentView extends React.Component {
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
      const {
        doc,
        onDeleteSuccess,
        deleteDocument: boundDeleteDocument,
      } = this.props;
      boundDeleteDocument(doc._id).then(() => {
        onDeleteSuccess();
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
      const { doc } = this.props;
      if (this.state.isEditing) {
        return (
          <EditDocument
            document={doc}
            onCancel={this.handleEditStop}
            onEditSuccess={this.handleEditStop}
          />
      );
      }
      return (
        <div>
          <Component
            {...doc}
            onEditClick={this.handleEditStart}
            onDeleteClick={this.handleOpenDeleteDialog}
            {...omit(this.props, 'doc')}
          />
          <Dialog open={this.state.openDeleteDialog}>
            <DialogContent>
              Delete the document <strong>{doc.title}</strong>
            </DialogContent>
            <DialogActions>
              <Button colored id="btn-delete" onClick={this.handleDelete}>
                Delete
              </Button>
              <Button
                colored
                id="btn-cancel"
                onClick={this.handleCloseDeleteDialog}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
  }

  const displayName = Component.displayName || Component.name || 'Component';
  DocumentView.displayName = `DocumentView(${displayName})`;

  DocumentView.propTypes = {
    doc: PropTypes.object.isRequired,
    deleteDocument: PropTypes.func.isRequired,
    onDeleteSuccess: PropTypes.func.isRequired,
    canEdit: PropTypes.bool,
    canDelete: PropTypes.bool,
    canEditAccess: PropTypes.bool,
  };

  return DocumentView;
};

export const mapStateToProps = (state, ownProps) => {
  const { doc } = ownProps;

  const canEdit = doc && state.authenticatedUser &&
    (doc.access.write === 'authenticated' ||
    doc.owner && doc.owner._id === state.authenticatedUser._id);

  const canDelete = doc && state.authenticatedUser &&
    (doc.owner && doc.owner._id === state.authenticatedUser._id ||
    state.authenticatedUser.role.title === 'admin');

  const canEditAccess = doc && state.authenticatedUser &&
    doc.owner && doc.owner._id === state.authenticatedUser._id;

  return {
    doc,
    canEdit,
    canDelete,
    canEditAccess,
  };
};

export default Component => connect(mapStateToProps, {
  deleteDocument,
})(createDocumentView(Component));
