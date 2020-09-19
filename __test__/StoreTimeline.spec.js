import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';

import StoreTimeline from '../src/devtools/view/StoreTimeline';

configure({ adapter: new Adapter() });

describe('StoreTimeline', () => {
  let wrapper;
  let parent;
  const props = { //perhaps change this prop at some point
    "hi": true,
    "nested": { "this": "that" }
  }

  beforeAll(() => {
    wrapper = shallow(<StoreTimeline {...props} />);
    parent = wrapper.children().first()
  });

  it('Renders a <div> tag with a className of "column"', () => {
    // expect(children.length).toEqual(2); 
    // expect(children.first().type()).toEqual('div'); // <-- referring to nested div tags
    expect(parent.hasClass('column')).toEqual(true);
    // expect(children.last().type()).toEqual('div'); // <-- function storeDisplayer
    // expect(children.hasClass('column')).toEqual(true);
  });

  // it('Has two children with <div> tag className of "display-box" and "snapshots"', () => {
  //   expect(children.length).toEqual(2);
  //   expect(wrapper.children.type()).toEqual('div');
  //   expect(wrapper.find(`.column`).children.first().hasClass('display-box')).toEqual(true);
  //   expect(wrapper.find(`.column`).children.last().hasClass('snapshots')).toEqual(true);
  // });

  // it('Has')

  // it('Has one child <div> tag with a className of "snapshot-wrapper" with a  ', () => {
  //   expect(children.length).toEqual(2);
  //   expect(children.first().hasClass('objectProperty')).toEqual(true);
  //   expect(children.last().hasClass('nestedObject')).toEqual(true);
  // })

});

// it('Renders a <div> tag with a className of "records"', () => { //we are using methods from enzyme library so look at the docs
//   expect(wrapper.type()).toEqual('div');
//   expect(wrapper.hasClass('records')).toEqual(true);
// });