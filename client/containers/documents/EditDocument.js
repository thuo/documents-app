import { connect } from 'react-redux';
import humps from 'humps';
import omit from 'lodash/omit';
import { editDocument } from 'app/actions/DocumentActions';
import DocumentForm from 'app/components/documents/DocumentForm';
import createForm from 'app/containers/util/createForm';
import { validate } from './AddDocument';

export const submit = (values, ctx) => new Promise((resolve, reject) => {
  const { defaultValues: { _id }, editDocument: boundEditDocument } = ctx.props;
  boundEditDocument(_id, humps.decamelizeKeys(values)).then(() => {
    const { error, onEditSuccess } = ctx.props;
    if (!error) {
      // since on edit success is optional check if it is provided and it is a
      // function before calling it
      typeof onEditSuccess === 'function' && onEditSuccess();
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
  const defaultValues = Object.assign(omit(doc, 'access'), {
    readAccess: doc.access.read,
    writeAccess: doc.access.write,
  });
  return {
    error,
    loading,
    onEditSuccess,
    defaultValues,
    title: 'Edit Document',
  };
};

export default connect(
  mapStateToProps, {
    editDocument,
  }
)(EditDocument);
