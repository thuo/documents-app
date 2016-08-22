import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import DocumentFilter from 'app/components/documents/DocumentFilter';

describe('DocumentFilter', () => {
  it('renders search field', () => {
    const props = {
      searchFilter: 'lorem',
      setSearchFilter: sinon.spy(),
    };
    const wrapper = shallow(<DocumentFilter {...props} />);
    const search = wrapper.find({ label: 'Search' });
    expect(search.prop('value')).to.equal(props.searchFilter);
    const event = { preventDefault: () => {}, target: { value: 'ipsum' } };
    search.simulate('change', event);
    expect(props.setSearchFilter.withArgs('ipsum').calledOnce).to.be.true;
  });

  it('renders access field', () => {
    const props = {
      accessFilter: 'public',
      setAccessFilter: sinon.spy(),
    };
    const wrapper = shallow(<DocumentFilter {...props} />);
    const access = wrapper.find('#access');
    expect(access.prop('value')).to.equal(props.accessFilter);
    const event = { preventDefault: () => {}, target: { value: 'private' } };
    access.simulate('change', event);
    expect(props.setAccessFilter.withArgs('private').calledOnce).to.be.true;
  });


  it('renders the clear filter button', () => {
    const props = {
      accessFilter: '',
      searchFilter: '',
      setSearchFilter: sinon.spy(),
      setAccessFilter: sinon.spy(),
    };
    const wrapper = shallow(<DocumentFilter {...props} />);
    const button = wrapper.find('Button');
    expect(button.children().text()).to.equal('Clear Filters');
    button.simulate('click', { preventDefault: () => {} });
    expect(props.setSearchFilter.withArgs('').calledOnce).to.be.true;
    expect(props.setAccessFilter.withArgs('').calledOnce).to.be.true;
  });
});
