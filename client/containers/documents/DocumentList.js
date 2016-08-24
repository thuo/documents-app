import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import FABButton from 'react-mdl/lib/FABButton';
import Icon from 'react-mdl/lib/Icon';
import Spinner from 'react-mdl/lib/Spinner';
import {
  fetchDocuments, setDocumentsAccessFilter, setDocumentsSearchFilter,
} from 'app/actions/DocumentActions';
import DocumentListItem from 'app/components/documents/DocumentListItem';
import AppError from 'app/components/error/AppError';
import DocumentFilter from 'app/components/documents/DocumentFilter';
import checkDocumentAccess from 'app/utils/checkDocumentAccess';

export class DocumentList extends React.Component {

  constructor(props) {
    super(props);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchDocuments();
  }

  handleDocumentClick(documentId) {
    this.props.pushToHistory(`/documents/${documentId}`);
  }

  render() {
    const { error, loading } = this.props;
    if (error || loading) {
      return (<AppError>{this.props.error || <Spinner />}</AppError>);
    }
    const fabStyle = {
      position: 'fixed',
      right: '1em',
      bottom: '1em',
      zIndex: 2,
    };
    const style = {
      marginBottom: '6em',
    };
    const {
      accessFilter,
      searchFilter,
      setDocumentsSearchFilter: setSearchFilter,
      setDocumentsAccessFilter: setAccessFilter,
      documents,
      pushToHistory,
    } = this.props;
    return (
      <div style={style}>
        <DocumentFilter
          accessFilter={accessFilter}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          setAccessFilter={setAccessFilter}
        />
        {documents.map(doc =>
          <DocumentListItem
            doc={doc}
            onDeleteSuccess={() => {}}
            key={doc._id}
            onDocumentClick={this.handleDocumentClick}
          />
        )}
        <FABButton
          ripple
          colored
          accent
          className="mdl-shadow--4dp"
          id="add"
          style={fabStyle}
          onClick={() => { pushToHistory('/documents/add'); }}>
          <Icon name="add" />
          <span className="visuallyhidden">Add</span>
        </FABButton>
      </div>
    );
  }
}

export const mapStateToProps = state => {
  const { documentList, entities, authenticatedUser } = state;
  const { accessFilter, searchFilter } = documentList;
  const documents = documentList.documents.map(docId => {
    const doc = Object.assign({}, entities.documents[docId]);
    doc.owner = entities.users[doc.owner];
    return doc;
  }).filter(
    checkDocumentAccess(authenticatedUser)
  ).filter(doc => {
    let matchesSearchFilter = true;
    if (searchFilter) {
      const regex = new RegExp(searchFilter, 'ig');
      matchesSearchFilter = regex.test(doc.title) || regex.test(doc.content);
    }
    let matchesAccessFilter = true;
    if (accessFilter) {
      matchesAccessFilter = doc.access.read === accessFilter;
    }
    return matchesAccessFilter && matchesSearchFilter;
  });
  const { loading } = documentList;
  const error = documentList.error && documentList.error.error;
  return { documents, error, loading, accessFilter, searchFilter };
};


DocumentList.propTypes = {
  documents: PropTypes.array,
  error: PropTypes.string,
  loading: PropTypes.bool,
  fetchDocuments: PropTypes.func.isRequired,
  pushToHistory: PropTypes.func.isRequired,
  setDocumentsAccessFilter: PropTypes.func.isRequired,
  setDocumentsSearchFilter: PropTypes.func.isRequired,
  accessFilter: PropTypes.string.isRequired,
  searchFilter: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps, {
    pushToHistory: push,
    fetchDocuments,
    setDocumentsAccessFilter,
    setDocumentsSearchFilter,
  }
)(DocumentList);
