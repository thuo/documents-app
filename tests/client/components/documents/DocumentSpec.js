import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import {
  Document,
  __RewireAPI__ as RewireAPI,
} from 'app/components/documents/Document';

describe('Document', () => {
  const marked = markdown => markdown;

  before(() => {
    RewireAPI.__Rewire__('marked', marked);
  });

  after(() => {
    RewireAPI.__ResetDependency__('marked');
  });

  it('renders the title', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
    };
    const wrapper = shallow(<Document {...props} />);
    const title = wrapper.find('CardTitle');
    expect(title.children().text()).to.equal(props.title);
  });

  it('renders the document info', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
    };
    const wrapper = shallow(<Document {...props} />);
    const info = wrapper.find('DocumentInfo');
    expect(info.props()).to.eql(props);
  });

  it('renders the content', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
    };
    const wrapper = shallow(<Document {...props} />);
    const content = wrapper.find('CardText').at(1);
    const text = content.prop('dangerouslySetInnerHTML').__html;
    expect(text).to.equal(props.content);
  });

  it('renders the edit button', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      canEdit: true,
      onEditClick: sinon.spy(),
    };
    const wrapper = shallow(<Document {...props} />);
    const button = wrapper.find('Button');
    expect(button.children().text()).to.equal('Edit');
    button.simulate('click');
    expect(props.onEditClick.calledOnce).to.be.true;
  });

  it('renders the delete button', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      canDelete: true,
      onDeleteClick: sinon.spy(),
    };
    const wrapper = shallow(<Document {...props} />);
    const button = wrapper.find('Button');
    expect(button.children().text()).to.equal('Delete');
    button.simulate('click');
    expect(props.onDeleteClick.calledOnce).to.be.true;
  });

  it('renders both the edit and delete buttons', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      canEdit: true,
      canDelete: true,
    };
    const wrapper = shallow(<Document {...props} />);
    const button = wrapper.find('Button');
    expect(button.at(0).children().text()).to.equal('Edit');
    expect(button.at(1).children().text()).to.equal('Delete');
  });
});
