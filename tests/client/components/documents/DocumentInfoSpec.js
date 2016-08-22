import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import DocumentInfo from 'app/components/documents/DocumentInfo';

describe('DocumentInfo', () => {
  it('renders the author and creation date', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      owner: { _id: 1, name: { first: 'Foo', last: 'Bar' } },
      access: { read: 'public', write: 'private' },
    };
    const wrapper = shallow(<DocumentInfo {...props} />);
    const ownerAndDate = wrapper.find('.doc-owner-and-date');
    expect(ownerAndDate.text()).to.match(/^Created by <Link \/> at /);
    expect(ownerAndDate.find('Link').prop('to')).to.equal('/users/1');
  });

  it('renders the creation date', () => {
    const createdAt = new Date().toISOString();
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      owner: { _id: 1, name: { first: 'Foo', last: 'Bar' } },
      access: { read: 'public', write: 'private' },
      createdAt,
      updatedAt: createdAt,
    };
    const wrapper = shallow(<DocumentInfo {...props} />);
    const ownerAndDate = wrapper.find('.doc-owner-and-date');
    const createdAtRegex =
      /at \d?\d(st|nd|rd|th) [A-Z][a-z][a-z] \d\d\d\d, \d?\d:\d\d(am|pm)/;
    expect(ownerAndDate.text()).to.match(createdAtRegex);
    expect(ownerAndDate.text()).to.not.contain('edited');
  });

  it('renders the edit date', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      owner: { _id: 1, name: { first: 'Foo', last: 'Bar' } },
      access: { read: 'public', write: 'private' },
      createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const wrapper = shallow(<DocumentInfo {...props} />);
    const ownerAndDate = wrapper.find('.doc-owner-and-date');
    const updatedAt =
      /; edited \d?\d(st|nd|rd|th) [A-Z][a-z][a-z] \d\d\d\d, \d?\d:\d\d(am|pm)/;
    expect(ownerAndDate.text()).to.match(updatedAt);
  });


  it('renders the read details (private, private)', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      owner: { _id: 1, name: { first: 'Foo', last: 'Bar' } },
      access: { read: 'private', write: 'private' },
    };
    const wrapper = shallow(<DocumentInfo {...props} />);
    const access = wrapper.find('.doc-access-details');
    expect(access.text()).to.equal('Visible to Owner; Editable by Owner');
  });

  it('renders the read details(authenticated, authenticated)', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      owner: { _id: 1, name: { first: 'Foo', last: 'Bar' } },
      access: { read: 'authenticated', write: 'authenticated' },
    };
    const wrapper = shallow(<DocumentInfo {...props} />);
    const access = wrapper.find('.doc-access-details');
    expect(access.text()).to.equal(
      'Visible to Logged In Users; Editable by Logged In Users');
  });

  it('renders the read details(authenticated, private)', () => {
    const props = {
      title: 'Lorem',
      content: 'ipsum',
      owner: { _id: 1, name: { first: 'Foo', last: 'Bar' } },
      access: { read: 'authenticated', write: 'private' },
    };
    const wrapper = shallow(<DocumentInfo {...props} />);
    const access = wrapper.find('.doc-access-details');
    expect(access.text()).to.equal(
      'Visible to Logged In Users; Editable by Owner');
  });
});
