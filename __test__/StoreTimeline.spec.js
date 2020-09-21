import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreTimeline from '../src/devtools/view/StoreTimeline';

configure({ adapter: new Adapter() });

describe('StoreTimeline', () => {
  let wrapper;
  const props = {
    store: {
      '1': {
        '__id': '1',
        '__typename': 'User',
        'name': 'Marc'
      },
      '2': {
        '__id': '2',
        '__typename': 'User',
        'name': 'Aryeh'
      },
      '3': {
        '__id': '3',
        '__typename': 'User',
        'name': 'Liz'
      },
      '4': {
        '__id': '4',
        '__typename': 'User',
        'name': 'Qwen'
      },
      '5': {
        '__id': '5',
        '__typename': 'Post',
        'text': 'Hi'
      },

    }
  }

  beforeAll(() => {
    wrapper = shallow(<StoreTimeline {...props} />);
  });

  it("Has a StoreDisplayer component", () => {

  })

  it("Passes the store as a prop to StoreDisplayer", () => {

  })

  it("Passes the store based on the currentEnvID", () => {

  })


  describe("Snapshots", () => {

    it("Takes a snapshot at startup", () => {

    })

    it("Has a snapshot button that takes and saves a snapshot", () => {

    })

    it("Defaults to displaying the latest store value when a snapshot is taken", () => {

    })

    it("Remembers snapshots when switching between environments", () => {

    })

    it("Has a snapshot text input", () => {

    })

    it("Has a previous buttons to move to the previous snapshot", () => {

    })

    it("Has a next button to move to the previous snapshot", () => {

    })

    it("Has a current button that shows the current store value", () => {

    })

    it("Has a slider that updates when a new snapshot is taken and when switching between environments", () => {

    })


  })

  it('Renders correctly', () => {
    const tree = renderer.create(<StoreTimeline {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  })

});