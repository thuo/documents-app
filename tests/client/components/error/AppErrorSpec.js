import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import AppError from 'app/components/error/AppError';

describe('AppError', () => {
  it('renders the error', () => {
    const wrapper = shallow(
      <AppError>
        <strong>bad</strong>
      </AppError>
    );
    const error = wrapper.find('h2');
    expect(error).to.have.length(1);
    expect(error.children().text()).to.equal('bad');
  });
});
