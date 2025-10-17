import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {
  let AppComponent;
  let AppDOM;

  // ---------- TEST 1 ----------
  test('When user hasn’t specified a number, 32 events are shown by default', ({ given, when, then }) => {
    given('the user hasn’t specified the number of events', () => {});

    when('the user opens the app', () => {
      AppComponent = render(<App />);
      AppDOM = AppComponent.container;
    });

    then('32 events should be displayed by default', async () => {
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });
    });
  });

  // ---------- TEST 2 ----------
  test('User can change the number of events displayed', ({ given, when, then }) => {
    given('the user has opened the app', async () => {
      AppComponent = render(<App />);
      AppDOM = AppComponent.container;
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });
    });

    when('the user sets the number of events to 10', async () => {
      const user = userEvent.setup();
      const input =
        AppDOM.querySelector('#number-of-events') ||
        within(AppDOM).queryByRole('spinbutton');
      await user.clear(input);
      await user.type(input, '10');
    });

    then('only 10 events should be displayed', async () => {
      const EventListDOM = AppDOM.querySelector('#event-list');
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(10);
      });
    });
  });
});
