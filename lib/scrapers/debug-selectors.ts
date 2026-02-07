import { fetchDynamicHTML } from './utils';
import * as cheerio from 'cheerio';
import * as fs from 'fs';

async function debugEventbrite() {
  console.log('🔍 Debugging Eventbrite selectors...');
  
  const html = await fetchDynamicHTML('https://www.eventbrite.com.au/d/australia--sydney/all-events/');
  
  // Save HTML to file for inspection
  fs.writeFileSync('debug-eventbrite.html', html);
  console.log('✅ Saved HTML to debug-eventbrite.html');
  
  const $ = cheerio.load(html);
  
  // Try to find event containers
  console.log('\n=== Looking for event containers ===');
  
  const selectors = [
    'article',
    'div[class*="event"]',
    'div[class*="card"]',
    'li[class*="event"]',
    'a[href*="/e/"]',
    '[data-event-id]',
    '[data-testid]',
  ];
  
  selectors.forEach(selector => {
    const count = $(selector).length;
    if (count > 0) {
      console.log(`✅ ${selector}: ${count} elements`);
      
      // Show first element's classes
      const firstClasses = $(selector).first().attr('class');
      console.log(`   First element classes: ${firstClasses}`);
    }
  });
  
  // Look for event titles
  console.log('\n=== Looking for titles ===');
  const titleSelectors = ['h1', 'h2', 'h3', 'h4'];
  titleSelectors.forEach(selector => {
    const count = $(selector).length;
    if (count > 0) {
      console.log(`${selector}: ${count} found`);
      const firstText = $(selector).first().text().trim();
      console.log(`   First: "${firstText.substring(0, 80)}..."`);
    }
  });
}

async function debugHumanitix() {
  console.log('\n\n🔍 Debugging Humanitix selectors...');
  
  const html = await fetchDynamicHTML('https://humanitix.com/au/sydney/events');
  
  fs.writeFileSync('debug-humanitix.html', html);
  console.log('✅ Saved HTML to debug-humanitix.html');
  
  const $ = cheerio.load(html);
  
  console.log('\n=== Looking for event containers ===');
  const selectors = [
    'article',
    'div[class*="event"]',
    'div[class*="card"]',
    'a[href*="/event"]',
    '[data-event]',
    'li',
  ];
  
  selectors.forEach(selector => {
    const count = $(selector).length;
    if (count > 0) {
      console.log(`✅ ${selector}: ${count} elements`);
      const firstClasses = $(selector).first().attr('class');
      console.log(`   First element classes: ${firstClasses}`);
    }
  });
}

// Run both
debugEventbrite().then(() => debugHumanitix()).catch(console.error);