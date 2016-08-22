import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import NotFound from 'app/components/error/NotFound';

describe('NotFound', () => {
  it('renders not found', () => {
    const wrapper = shallow(<NotFound />);
    const error = wrapper.find('AppError');
    expect(error).to.have.length(1);
    expect(error.children().text()).to.equal('Not Found');
  });
});
