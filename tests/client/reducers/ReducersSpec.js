import { expect } from 'chai';
import * as actions from 'app/actions';
import { documents, error } from 'app/reducers';

describe('Reducers', () => {
  describe('documents', () => {
    it('returns the initial state', () => {
      expect(documents(undefined, {})).to.eql([]);
    });

    it('handles DOCUMENTS_SUCCESS', () => {
      expect(documents([], {
        type: actions.DOCUMENTS_SUCCESS,
        response: ['documents'],
      })).to.eql(['documents']);
    });

    it('handles DOCUMENTS_FAILURE', () => {
      expect(documents(['documents'], {
        type: actions.DOCUMENTS_FAILURE,
        response: { error: 'error' },
      })).to.eql([]);
    });
  });
  describe('error', () => {
    it('returns the initial state', () => {
      expect(error(undefined, {})).to.eql({});
    });

    it('handles DOCUMENTS_SUCCESS', () => {
      expect(error({ error: 'error' }, {
        type: actions.DOCUMENTS_SUCCESS,
        response: ['documents'],
      })).to.eql({});
    });

    it('handles DOCUMENTS_FAILURE', () => {
      expect(error({}, {
        type: actions.DOCUMENTS_FAILURE,
        error: { error: 'error' },
      })).to.eql({ error: 'error' });
    });
  });
});
