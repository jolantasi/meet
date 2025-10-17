// src/features/showHideAnEventsDetails.test.js
import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import Event from '../components/Event';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
  // ---------- TEST 1 ----------
  test('An event element is collapsed by default', ({ given, when, then }) => {
    let AppComponent;
    
    given('the user has opened the app', () => {
      AppComponent = render(<App />);
    });

    when('the list of events is loaded', async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });
    });

    then('the event element should be collapsed by default', () => {
      const AppDOM = AppComponent.container.firstChild;
      const eventDetails = AppDOM.querySelectorAll('.event-details');
      eventDetails.forEach(detail => {
        expect(detail).not.toBeVisible();
      });
    });
  });

  // ---------- TEST 2 ----------
  test('User can expand an event to see its details', ({ given, when, then }) => {
    let AppComponent;
    let AppDOM;
    let button;

    given('the user sees a list of events', async () => {
      AppComponent = render(<App />);
      AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });
    });

    when('the user clicks on an event’s “Show Details” button', async () => {
      const user = userEvent.setup();
      button = AppDOM.querySelector('.details-btn');
      await user.click(button);
    });

    then('the event element should expand to show its details', () => {
      const eventDetails = AppDOM.querySelector('.event-details');
      expect(eventDetails).toBeInTheDocument();
    });
  });

  // ---------- TEST 3 ----------
  test('User can collapse an event to hide its details', ({ given, when, then }) => {
    let AppComponent;
    let AppDOM;
    let button;

    given('the event details are currently displayed', async () => {
      AppComponent = render(<App />);
      const user = userEvent.setup();
      AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');
      
      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBeGreaterThan(0);
      });

      button = AppDOM.querySelector('.details-btn');
      await user.click(button);
      
      const eventDetails = AppDOM.querySelector('.event-details');
      expect(eventDetails).toBeInTheDocument();
    });

    when('the user clicks on the “Hide Details” button', async () => {
      const user = userEvent.setup();
      await user.click(button);
    });

    then('the event element should collapse and hide the details', () => {
      const eventDetails = AppDOM.querySelector('.event-details');
      expect(eventDetails).not.toBeInTheDocument();
    });
  });
});