import { connect } from 'react-redux';
import { editDocument } from 'app/actions/DocumentActions';
import DocumentForm from 'app/components/documents/DocumentForm';
import createForm from 'app/containers/util/createForm';
import { validate } from './AddDocument';

export const submit = (values, ctx) => new Promise((resolve, reject) => {
  const props = ctx.props;
  props.editDocument(props.defaultValues._id, values).then(() => {
    const { error } = ctx.props;
    if (!error) {
      resolve();
    } else {
      ctx.showSnackbar(error.error);
      reject(error.error);
    }
  });
});

export const EditDocument = createForm(
  submit,
  validate
)(DocumentForm);

export const mapStateToProps = (state, ownProps) => {
  const { document: doc, onEditSuccess } = ownProps;
  const { error, loading } = state.editDocument;
  return {
    error,
    loading,
    onEditSuccess,
    defaultValues: doc,
    title: 'Edit document',
  };
};

export default connect(
  mapStateToProps, {
    editDocument,
  }
)(EditDocument);
