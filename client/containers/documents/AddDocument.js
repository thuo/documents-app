import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { addDocument } from 'app/actions/DocumentActions';
import DocumentForm from 'app/components/documents/DocumentForm';
import createForm from 'app/containers/util/createForm';
import authenticate from 'app/containers/util/authenticate';

export const submit = (values, ctx) => new Promise((resolve, reject) => {
  const props = ctx.props;
  props.addDocument(values).then(() => {
    const { error } = ctx.props;
    if (!error) {
      props.pushToHistory('/');
      resolve();
    } else {
      ctx.showSnackbar(error.error);
      reject(error.error);
    }
  });
});

export const validate = values => {
  const errors = {};
  if (!values.title) {
    errors.title = 'Required';
  }
  if (!values.content) {
    errors.content = 'Required';
  }
  return errors;
};

export const AddDocument = authenticate(createForm(
  submit,
  validate
)(DocumentForm));

export const mapStateToProps = state => state.addDocument;

export const mapDispatchToProps = dispatch => bindActionCreators({
  pushToHistory: push,
  addDocument,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddDocument);
