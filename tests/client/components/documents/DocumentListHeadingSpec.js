import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import DocumentListHeading from 'app/components/documents/DocumentListHeading';

describe('DocumentListHeading', () => {
  it('renders the title', () => {
    const props = {
      searchFilter: 'lorem',
      setSearchFilter: sinon.spy(),
    };
    const wrapper = shallow(<DocumentListHeading {...props} />);
    const title = wrapper.find('h5');
    expect(title.text()).to.equal('All documents');
  });

  it('renders access field', () => {
    const props = {
      accessFilter: 'public',
      setAccessFilter: sinon.spy(),
    };
    const wrapper = shallow(<DocumentListHeading {...props} />);
    const access = wrapper.find('SelectField');
    expect(access.prop('value')).to.equal(props.accessFilter);
    const event = { preventDefault: () => {}, target: { value: 'private' } };
    access.simulate('change', event);
    expect(props.setAccessFilter.withArgs('private').calledOnce).to.be.true;
  });
});
