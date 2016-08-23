import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import User from 'app/components/users/User';

describe('User', () => {
  it('renders the name', () => {
    const props = {
      name: { first: 'Linus', last: 'Torvalds' },
      role: 'admin',
    };
    const wrapper = shallow(<User {...props} />);
    const title = wrapper.find('CardTitle');
    expect(title.children().text()).to.equal('Linus Torvalds');
  });

  it('renders the details', () => {
    const props = {
      name: { first: 'Linus', last: 'Torvalds' },
      email: 'linus@example.com',
      username: 'torvalds',
      role: 'admin',
    };
    const wrapper = shallow(<User {...props} />);
    const details = wrapper.find('strong');
    expect(details.at(0).children().text()).to.equal('torvalds');
    expect(details.at(1).children().text()).to.equal('linus@example.com');
    expect(details.at(2).children().text()).to.equal('admin');
  });

  it('renders the edit button', () => {
    const props = {
      name: { first: 'Linus', last: 'Torvalds' },
      role: 'admin',
      canEdit: true,
      onEditClick: sinon.spy(),
    };
    const wrapper = shallow(<User {...props} />);
    const button = wrapper.find('Button');
    expect(button.children().text()).to.equal('Edit');
    button.simulate('click');
    expect(props.onEditClick.calledOnce).to.be.true;
  });

  it('renders the delete button', () => {
    const props = {
      name: { first: 'Linus', last: 'Torvalds' },
      role: 'admin',
      canDelete: true,
      onDeleteClick: sinon.spy(),
    };
    const wrapper = shallow(<User {...props} />);
    const button = wrapper.find('Button');
    expect(button.children().text()).to.equal('Delete');
    button.simulate('click');
    expect(props.onDeleteClick.calledOnce).to.be.true;
  });

  it('renders both the edit and delete buttons', () => {
    const props = {
      name: { first: 'Linus', last: 'Torvalds' },
      role: 'admin',
      canEdit: true,
      canDelete: true,
    };
    const wrapper = shallow(<User {...props} />);
    const button = wrapper.find('Button');
    expect(button.at(0).children().text()).to.equal('Edit');
    expect(button.at(1).children().text()).to.equal('Delete');
  });
});
