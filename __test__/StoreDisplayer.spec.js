import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreDisplayer from '../src/devtools/view/StoreDisplayer';

configure({ adapter: new Adapter() });

describe('StoreDisplayer', () => {

  let wrapper;
  const updateRecords = jest.fn();
  const setState = jest.fn();
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState]);
  const store = { "hi": "there" }

  beforeAll(() => {
    wrapper = shallow(<StoreDisplayer store={store} />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Does stuff", () => {
    updateRecords("")
    expect(setState).toHaveBeenCalledWith({});
  })
  describe('updateRecords', () => {
    //check output type
    //if store is undefined then setRecordsList not invoked
    //will filter store by type and id

  })

  describe('generateComponentsList', () => {

  })

  describe('Rendered components', () => {
    let wrapper;
    const props = {}


  })

});