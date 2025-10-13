import { render, screen } from '@testing-library/react';
import App from '../App';

describe('<App /> component', () => {
  let AppDOM;

  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test('renders list of events', () => {
    // Use querySelector with existing id
    const eventList = AppDOM.querySelector('#event-list');
    expect(eventList).toBeInTheDocument();
  });

  test('renders CitySearch', () => {
    // Use querySelector with existing id
    const citySearch = AppDOM.querySelector('#city-search');
    expect(citySearch).toBeInTheDocument();
  });

  test('renders NumberOfEvents component', () => {
    const { container } = render(<App />);
    const numberInput = container.querySelector('#number-of-events'); // input type=number
    expect(numberInput).toBeInTheDocument();
  });
});
