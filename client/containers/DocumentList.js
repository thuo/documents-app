import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchDocuments } from 'app/actions/DocumentActions';
import Document from 'app/components/Document';
import { FABButton, Icon } from 'react-mdl';

export class DocumentList extends React.Component {
  componentDidMount() {
    this.props.fetchDocuments();
  }

  render() {
    if (this.props.error) {
      const errorStyle = {
        textAlign: 'center',
        maxWidth: '892px',
        margin: '2em auto',
      };
      return (
        <h2 style={errorStyle}>
          {this.props.error}
        </h2>
      );
    }
    const fabStyle = {
      position: 'fixed',
      right: '1em',
      bottom: '1em',
      zIndex: 1000,
    };
    const style = {
      marginBottom: '6em',
    };
    return (
      <div style={style}>
        {this.props.documents.map(doc =>
          <Document {...doc} key={doc._id} />
        )}
        <FABButton
          ripple
          colored
          accent
          className="mdl-shadow--4dp"
          id="add"
          style={fabStyle} >
          <Icon name="add" />
          <span className="visuallyhidden">Add</span>
        </FABButton>
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  documents: state.documents.list,
  error: state.documents.error,
});

export const mapDispatchToProps = dispatch => ({
  fetchDocuments: () => dispatch(fetchDocuments()),
});

DocumentList.propTypes = {
  documents: PropTypes.array,
  error: PropTypes.string,
  fetchDocuments: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentList);
