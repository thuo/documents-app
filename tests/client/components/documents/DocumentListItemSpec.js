import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  DocumentListItem,
  __RewireAPI__ as RewireAPI,
} from 'app/components/documents/DocumentListItem';

describe('DocumentListItem', () => {
  const marked = markdown => markdown;

  before(() => {
    RewireAPI.__Rewire__('marked', marked);
  });

  after(() => {
    RewireAPI.__ResetDependency__('marked');
  });

  it('renders the title', () => {
    const props = {
      _id: 1,
      title: 'Lorem',
      content: 'ipsum',
      onDocumentClick: sinon.spy(),
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    const title = wrapper.find('CardTitle');
    expect(title.children().text()).to.equal(props.title);
    title.simulate('click', { preventDefault: () => {} });
    expect(props.onDocumentClick.withArgs(1).calledOnce).to.be.true;
  });

  it('renders the document info', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    const info = wrapper.find('DocumentInfo');
    expect(info.props()).to.eql(props);
  });

  it('renders the content', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    const content = wrapper.find('CardText').at(0);
    const text = content.prop('dangerouslySetInnerHTML').__html;
    expect(text).to.equal(props.content);
  });

  it('trims the content', () => {
    const props = {
      title: 'Lorem',
      content: Array(400).fill('a').join(''),
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    const content = wrapper.find('CardText').at(0);
    const text = content.prop('dangerouslySetInnerHTML').__html;
    expect(text).to.have.length(203);
    expect(text).to.match(/\.\.\.$/);
  });

  it('renders the menu', () => {
    const props = {
      _id: '1',
      title: 'Lorem',
      content: 'ipsum',
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    expect(wrapper.find('CardMenu')).to.have.length(1);
    expect(wrapper.find('#documents-1').name()).to.equal('IconButton');
    expect(wrapper.find('Menu').prop('target')).to.equal('documents-1');
  });

  it('renders the view menu item', () => {
    const props = {
      _id: 1,
      title: 'Lorem',
      content: 'ipsum',
      onDocumentClick: sinon.spy(),
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    const view = wrapper.find('MenuItem');
    expect(view).to.have.length(1);
    expect(view.children().text()).to.equal('View');
    view.simulate('click');
    expect(props.onDocumentClick.withArgs(props._id).calledOnce).to.be.true;
  });

  it('renders the edit menu item', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      canEdit: true,
      onEditClick: sinon.spy(),
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    const edit = wrapper.find('MenuItem').at(1);
    expect(edit.children().text()).to.equal('Edit');
    edit.simulate('click');
    expect(props.onEditClick.calledOnce).to.be.true;
  });

  it('renders the delete menu item', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      canDelete: true,
      onDeleteClick: sinon.spy(),
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    const del = wrapper.find('MenuItem').at(1);
    expect(del.children().text()).to.equal('Delete');
    del.simulate('click');
    expect(props.onDeleteClick.calledOnce).to.be.true;
  });

  it('renders both the edit and delete menu items', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      canEdit: true,
      canDelete: true,
    };
    const wrapper = shallow(<DocumentListItem {...props} />);
    const button = wrapper.find('MenuItem');
    expect(button.at(1).children().text()).to.equal('Edit');
    expect(button.at(2).children().text()).to.equal('Delete');
  });
});
