import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { fetchUsersDocuments } from 'app/actions/UserActions';
import DocumentListItem from 'app/components/documents/DocumentListItem';
import AppError from 'app/components/error/AppError';

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
    if (this.props.error) {
      return (
        <AppError>{this.props.error}</AppError>
      );
    }
    return (
      <div>
        {this.props.documents.map(doc =>
          <DocumentListItem
            key={doc._id}
            doc={doc}
            onDeleteSuccess={() => {}}
            onDocumentClick={this.handleDocumentClick}
          />
        )}
      </div>
    );
  }
}

DocumentList.propTypes = {
  documents: PropTypes.array,
  error: PropTypes.string,
  userId: PropTypes.string,
  fetchUsersDocuments: PropTypes.func.isRequired,
  pushHistory: PropTypes.func.isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  const { userId } = ownProps;
  const { documentsByUser: { [userId]: userDocuments }, entities } = state;
  if (!userDocuments) {
    return { documents: [], error: null, loading: false };
  }
  const documents = userDocuments.documents.map(docId => {
    const doc = Object.assign({}, entities.documents[docId]);
    doc.owner = entities.users[doc.owner];
    return doc;
  });
  const error = userDocuments.error;
  const loading = userDocuments.loading;
  return { documents, error, loading };
};

export default connect(
  mapStateToProps, {
    pushHistory: push,
    fetchUsersDocuments,
  }
)(DocumentList);
