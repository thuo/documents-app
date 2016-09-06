import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Spinner from 'react-mdl/lib/Spinner';
import { fetchUsersDocuments } from 'app/actions/UserActions';
import DocumentListItem from 'app/components/documents/DocumentListItem';
import AppError from 'app/components/error/AppError';
import checkDocumentAccess from 'app/utils/checkDocumentAccess';
import Grid, { Cell } from 'react-mdl/lib/Grid';

export class DocumentList extends React.Component {

  constructor(props) {
    super(props);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchUsersDocuments(this.props.userId);
  }

  handleDocumentClick(documentId) {
    this.props.pushHistory(`/documents/${documentId}`);
  }

  render() {
    const { error, loading } = this.props;
    if (error || loading) {
      return (<AppError>{error || <Spinner />}</AppError>);
    }
    return (
      <Grid>
        {this.props.documents.map(doc =>
          <Cell col={4} key={doc._id}>
            <DocumentListItem
              useDialogToEdit
              doc={doc}
              onDeleteSuccess={() => {}}
              onDocumentClick={this.handleDocumentClick}
            />
          </Cell>
        )}
      </Grid>
    );
  }
}

DocumentList.propTypes = {
  documents: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  userId: PropTypes.string,
  fetchUsersDocuments: PropTypes.func.isRequired,
  pushHistory: PropTypes.func.isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  const { userId } = ownProps;
  const {
    documentsByUser: { [userId]: userDocuments },
    entities,
    authenticatedUser,
  } = state;
  if (!userDocuments) {
    return { documents: [], error: null, loading: false };
  }
  const documents = userDocuments.documents.map(docId => {
    const doc = Object.assign({}, entities.documents[docId]);
    doc.owner = entities.users[doc.owner];
    return doc;
  }).filter(checkDocumentAccess(authenticatedUser));
  const { loading } = userDocuments;
  const error = userDocuments.error && userDocuments.error;
  return { documents, error, loading };
};

export default connect(
  mapStateToProps, {
    pushHistory: push,
    fetchUsersDocuments,
  }
)(DocumentList);
