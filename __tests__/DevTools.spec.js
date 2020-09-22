import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import DevTools from '../src/devtools/DevTools';

configure({ adapter: new Adapter() });

describe('DevTools', () => {
  let wrapper;
  const RealDate = Date;
  const names = { 1: "first", 2: "second", 3: "third" }
  const props = {
    store: {
      getEnvironmentIDs: () => [1, 2, 3],
      getEnvironmentName: (id) => names[id]
    },
    bridge: "hi"
  }

  beforeAll(() => {
    wrapper = shallow(<DevTools {...props} />);
  });

  it("Passes the bridge to provider", () => {
    expect(wrapper.prop("value")).toEqual(props.bridge)
  })

  it("Passes the store to provider", () => {
    expect(wrapper.children().first().prop("value")).toEqual(props.store)
  })

  it("Has a dropdown select element for environmentID with an onChange method", () => {
    expect(wrapper.find('select').length).toEqual(1);
    expect(wrapper.find('select').prop('onChange')).not.toEqual(undefined);
  })

  it("Lists environments in dropdown selector", () => {
    const option = wrapper.find('option')
    expect(option.length).toEqual(3);
    expect(option.at(0).text()).toEqual(names[1]);
    expect(option.at(1).text()).toEqual(names[2]);
    expect(option.at(2).text()).toEqual(names[3]);
    expect(option.at(0).prop('value')).toEqual(1);
    expect(option.at(1).prop('value')).toEqual(2);
    expect(option.at(2).prop('value')).toEqual(3);
  })

  it("Has a StoreTimeline component", () => {
    expect(wrapper.find('StoreTimeline').length).toEqual(1)
  })

  it("Has a NetworkDisplayer component", () => {
    expect(wrapper.find('NetworkDisplayer').length).toEqual(1)
  })

  it("Passes the current environment to a currentEnvID prop on StoreTimeline and defaults to the first ID", () => {
    expect(wrapper.find('StoreTimeline').prop('currentEnvID')).toEqual(1);
  })

  it("Can select between different environments and pass the current environment to a currentEnvID prop on StoreTimeline", () => {
    wrapper.find('select').simulate('change', { target: { value: 2 } })
    expect(wrapper.find('StoreTimeline').prop('currentEnvID')).toEqual(2);
    wrapper.find('select').simulate('change', { target: { value: 3 } })
    expect(wrapper.find('StoreTimeline').prop('currentEnvID')).toEqual(3);
    wrapper.find('select').simulate('change', { target: { value: 1 } })
    expect(wrapper.find('StoreTimeline').prop('currentEnvID')).toEqual(1);
  })

  it("Has network hidden by default and store is visible", () => {
    expect(wrapper.find('StoreTimeline').parent().hasClass("is-hidden")).toEqual(false);
    expect(wrapper.find('NetworkDisplayer').parent().hasClass("is-hidden")).toEqual(true);
  })

  it("Allows user to select between store and network view", () => {
    const networkSelector = wrapper.find("#networkSelector")
    expect(networkSelector.length).toEqual(1);
    expect(networkSelector.prop('onClick')).not.toEqual(undefined);
    networkSelector.simulate('click');
    expect(wrapper.find('StoreTimeline').parent().hasClass("is-hidden")).toEqual(true);
    expect(wrapper.find('NetworkDisplayer').parent().hasClass("is-hidden")).toEqual(false);

    const storeSelector = wrapper.find("#storeSelector")
    expect(storeSelector.length).toEqual(1);
    expect(storeSelector.prop('onClick')).not.toEqual(undefined);
    storeSelector.simulate('click');
    expect(wrapper.find('StoreTimeline').parent().hasClass("is-hidden")).toEqual(false);
    expect(wrapper.find('NetworkDisplayer').parent().hasClass("is-hidden")).toEqual(true);
  })

  it('Renders correctly', () => {
    const date = new Date('December 19, 1985 9:03:00 GMT-05:00');
    global.Date = jest.fn(() => date);
    const tree = renderer.create(<DevTools {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
    jest.clearAllMocks();
  })
});