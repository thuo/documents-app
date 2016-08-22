import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Dialog from 'app/components/util/Dialog';

describe('Dialog', () => {
  it('renders the dialog content', () => {
    const wrapper = shallow(
      <Dialog className="col s6">
        <div>dialog</div>
      </Dialog>
    );
    const container = wrapper.find('.mdl-dialog__container.col.s6');
    expect(container).to.have.length(1);
    const dialog = wrapper.find('.mdl-dialog');
    expect(dialog).to.have.length(1);
    expect(dialog.children().text()).to.equal('dialog');
  });

  it('assign visible class when dialog is open', () => {
    const wrapper = shallow(
      <Dialog open className="col s6">
        <div>dialog</div>
      </Dialog>
    );
    const container = wrapper.find('.mdl-dialog__container.visible.col.s6');
    expect(container).to.have.length(1);
  });
});
