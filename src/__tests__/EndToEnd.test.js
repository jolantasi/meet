/**
 * @jest-environment node
 */
import puppeteer from 'puppeteer';
import { test, expect, describe } from '@jest/globals';

describe('show/hide event details', () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.event');
  });

  afterAll(() => {
    browser.close();
  });

  test('An event element is collapsed by default', async () => {
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });

  test('User can expand an event to see details', async () => {
    await page.click('.event .details-btn');
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeDefined();
  });

test('User can collapse an event to hide details', async () => {
    await page.click('.event .details-btn');
    const eventDetails = await page.$('.event .details');
    expect(eventDetails).toBeNull();
  });

});

describe('filter events by city', () => {
  let browser;
  let page;

  // Increase default Jest timeout for slow Puppeteer actions
  jest.setTimeout(60000);

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // set to false if you want to watch the browser
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
    await page.goto('http://localhost:5173/'); // your local dev URL
    await page.waitForSelector('.event');
  });

  afterAll(async () => {
    await browser.close();
  });

  // Reset input before each test
  beforeEach(async () => {
    await page.evaluate(() => {
      const input = document.querySelector('.city');
      if (input) input.value = '';
    });
  });

  // Scenario 1
  test('When user hasn’t searched for a city, show upcoming events from all cities', async () => {
    const events = await page.$$('.event');
    expect(events.length).toBeGreaterThan(1); // assuming multiple cities exist
  });

  // Scenario 2
  test('User should see a list of suggestions when they search for a city', async () => {
    await page.click('.city');             // focus input
    await page.type('.city', 'Berlin');    // type city

    // Wait for at least one suggestion to appear
    await page.waitForFunction(() => {
      const suggestions = document.querySelectorAll('.suggestions li');
      return suggestions.length > 0;
    }, { timeout: 15000 });

    const suggestions = await page.$$('.suggestions li');
    expect(suggestions.length).toBeGreaterThan(0);

    const firstSuggestionText = await page.evaluate(el => el.textContent, suggestions[0]);
    expect(firstSuggestionText.toLowerCase()).toContain('berlin');
  });

  // Scenario 3
  test('User can select a city from the suggested list', async () => {
    await page.click('.city');             // focus input
    await page.type('.city', 'Berlin');    // type city

    // Wait for suggestions to render
    await page.waitForFunction(() => {
      const suggestions = document.querySelectorAll('.suggestions li');
      return suggestions.length > 0;
    }, { timeout: 15000 });

    const suggestion = await page.$('.suggestions li');
    await suggestion.click();

    // Wait for events to update dynamically
    await page.waitForFunction(() => {
      const events = document.querySelectorAll('.event');
      return events.length > 0 && [...events].every(event =>
        event.querySelector('.event-location')?.textContent.includes('Berlin')
      );
    }, { timeout: 15000 });

    const events = await page.$$('.event');
    expect(events.length).toBeGreaterThan(0);

    // Optional: Verify each event location contains 'Berlin'
    for (let i = 0; i < events.length; i++) {
      const locationText = await page.$eval(
        `.event:nth-child(${i + 1}) .event-location`,
        el => el.textContent
      );
      expect(locationText).toContain('Berlin');
    }
  });
});