import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchDocumentIfNeeded } from 'app/actions/DocumentActions';
import Document from 'app/components/documents/Document';

export class DocumentList extends React.Component {

  componentDidMount() {
    this.props.fetchDocumentIfNeeded(this.props.params.documentId);
  }

  render() {
    const { document: doc } = this.props;
    if (!doc) {
      return <p> error </p>;
    }
    return (
      <Document
        {...doc}
        key={doc._id}
      />
    );
  }
}

export const mapStateToProps = (state, ownProps) => ({
  document: state.documents.list.find(doc =>
    doc._id === ownProps.params.documentId
  ),
  error: state.getDocumentError,
});

export const mapDispatchToProps = dispatch => bindActionCreators({
  fetchDocumentIfNeeded,
}, dispatch);

DocumentList.propTypes = {
  document: PropTypes.object,
  fetchDocumentIfNeeded: PropTypes.func.isRequired,
  params: PropTypes.shape({
    documentId: PropTypes.string,
  }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentList);
