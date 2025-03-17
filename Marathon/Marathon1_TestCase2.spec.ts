import { test, expect } from '@playwright/test'
import { SalesForceLogin, Entry} from '../../test-data/Marathon1/data.json'
test('New Case Creation', async ({ page }) => {
  const user = SalesForceLogin.userName;
  const pwd = SalesForceLogin.pwd;
  const lname = Entry.lname;
  const ac_name = Entry.ac_name
  test.setTimeout(120000);
  // 1. Step: Launch the browser (Chrome / Edge / Firefox / Safari). 
  await page.goto('https://login.salesforce.com/');
  // Expected Result: User should see the respective browser getting launched.
  // 2. Step: Load the specified URL (https://login.salesforce.com/).
  // Expected Result: The Salesforce application’s login window should appear.
  // 3. Step: Enter the Username, Password and click on the Login button. 
  await page.locator('#username').fill(user);
  await page.locator('#password').fill(pwd);
  await page.locator('input#Login').click();
  // 4. Step: Click on the App Launcher toggle button.
  await page.locator('div.slds-icon-waffle').click({ timeout: 20000 });
  // 5. Step: Click on the View All link.
  await page.locator('button[aria-label="View All Applications"]').click();
  // 6. Step: Type ‘Service’ in the search box and click on the Service link. 
  let inputBox = page.getByPlaceholder('Search apps or items...');
  inputBox.fill("Service");
  inputBox.press('Enter');
  const serviceLocator = page.locator('[data-name=\'Service\']').first();
  await expect(serviceLocator).toBeVisible()
  await serviceLocator.click({ timeout: 80000 });
  //Contacts
  await page.locator('a[title=\'Contacts\']').click({ timeout: 80000 });
  const listView = page.locator('//button[text()=\'List View\']').nth(0);
  if ((await listView.count()) > 0) {
    await listView.click({ timeout: 50000 });
  }
  await page.locator('li[data-target-selection-name*="Contact"]').nth(0).click({ timeout: 10000 });
  await page.getByPlaceholder('Last Name').fill(lname);
  await page.locator('//button[text()="Save"]').click();
  const tOastMsg = await page.locator('.toastMessage.slds-text-heading--small.forceActionsText').textContent();
  console.log(tOastMsg);
  const expectedText = `Contact "${lname}" was created.`;
  expect(tOastMsg).toStrictEqual(expectedText);
  await page.locator('a[title=\'Contacts\']').click({ timeout: 80000 });
  const contactSearchBox = page.locator('[name=\'Contact-search-input\']')
  contactSearchBox.fill(lname);
  await contactSearchBox.press('Enter', { timeout: 50000 });
  expect(await page.locator('tbody>tr').count()).toBeGreaterThanOrEqual(1);
  console.log(`Matching rows of the Contact is/are ${await page.locator('tbody>tr').count()}`)
  await page.locator('a[title=\'Contacts\']').click({ timeout: 5000 });
  await page.locator('[title="Refresh"]').nth(0).click();
  const contactText_result = await page.locator('tbody>tr th a').nth(0).textContent();
  console.log(`Contact name: ${contactText_result}`);
  expect(contactText_result).toStrictEqual(lname);

  //Accounts
  await page.waitForTimeout(8000)
  await page.locator('a[title=\'Accounts\']').click({ timeout: 80000 });
  await page.locator('li[data-target-selection-name*="Account"]').nth(0).click();
  await page.locator('[name="Name"]').fill(ac_name)

  await page.locator('button[aria-label="Rating"]').click();
  await page.locator('lightning-base-combobox-item[data-value="Hot"]').click();
  await page.locator('//button[text()="Save"]').click();
  const tOastMsg2 = await page.locator('.toastMessage.slds-text-heading--small.forceActionsText').textContent();
  console.log(tOastMsg2);
  const expectedText2 = `Account "${ac_name}" was created.`;
  expect(tOastMsg2).toStrictEqual(expectedText2);
  await page.locator('a[title=\'Accounts\']').click({ timeout: 80000 });
  const AccountSearchBox = page.locator('[name=\'Account-search-input\']')
  await AccountSearchBox.fill(ac_name);
  await AccountSearchBox.press('Enter', { timeout: 50000 });
  expect(await page.locator('tbody>tr').count()).toBeGreaterThanOrEqual(1);
  console.log(`Matching rows of the Account is/are ${await page.locator('tbody>tr').count()}`)
  await page.locator('a[title=\'Accounts\']').click({ timeout: 5000 });
  await page.locator('[title="Refresh"]').nth(0).click();
  const AccountText_result = await page.locator('tbody>tr th a').nth(0).textContent();
  console.log(`Account name: ${AccountText_result}`);
  expect(AccountText_result).toStrictEqual(ac_name);
  //Case Creation
  await page.waitForTimeout(8000)
  await page.locator('a[title=\'Cases\']').click({ timeout: 80000 });
  await page.waitForSelector('li[data-target-selection-name*="Case"]', { state: 'visible', timeout: 30000 });
  await page.locator('li[data-target-selection-name*="Case"]').first().click();
  await page.locator('button[data-value="Medium"]').click();
  await page.locator('lightning-base-combobox-item').nth(1).click();
  await page.locator('button[aria-label="Case Origin"]').click();
  await page.locator('lightning-base-combobox-item[data-value="Email"]').click();
  await page.locator('input[name="Subject"]').fill('Product Return Request');
  await page.locator('div[class*="textarea-container"]>textarea').nth(0).fill('Requesting a return for a defective product');
  await page.locator('//button[text()="Save"]').click();
  const tOastMsg3 = await page.locator('.toastMessage.slds-text-heading--small.forceActionsText').textContent();
  console.log(tOastMsg3);
  expect(tOastMsg3).toMatch(/Case ".*" was created\./);
  await page.locator('button[class*="toastClose"]').click({ timeout: 2000 });
  //Edit a Case
  console.log(await page.locator('[field-label="Status"]').textContent());
  await page.locator('span[class*="inline-edit"]').nth(0).click({ timeout: 5000 });
  await page.locator('button[data-value="New"]').click();
  await page.locator('lightning-base-combobox-item').nth(3).click();
  await page.locator('//button[text()="Save"]').click();

  //Share an update

  await page.locator('button[title="Share an update..."]').click({ timeout: 50000 });
  await page.locator('div[data-placeholder="Share an update..."]').fill("Update 1", { timeout: 5000 });
  await page.locator('[class*="publisherShareButton "]').click(
    { timeout: 2000 }
  );
  await page.waitForSelector('.toastMessage.slds-text-heading--small.forceActionsText', { timeout: 8000 });
  const tOastMsg5 = await page.locator('.toastMessage.slds-text-heading--small.forceActionsText').textContent();
  console.log(tOastMsg5);
  const expectedText5 = `Your update was shared.`;
  expect(tOastMsg5).toContain(expectedText5);
  await page.locator('button[class*="toastClose"]').click({ timeout: 2000 });

  //Chatter
  await page.locator('[class*="feedItemActionTrigger"]').nth(0).click({ timeout: 8000 })
  await page.locator('ul>li[title="Like on Chatter"]').nth(0).click({ timeout: 8000 })
  const tOastMsg4 = await page.locator('.toastMessage.slds-text-heading--small.forceActionsText').textContent();
  console.log(tOastMsg4);
  const expectedText4 = `Post was liked.`;
  expect(tOastMsg4).toContain(expectedText4);
  await page.locator('button[class*="toastClose"]').click({ timeout: 2000 });
  await page.locator('//span[text()="Chatter"]').click({ timeout: 8000 })
  const timeText = await page.locator('//div/a[text()="Just now"]').textContent();
  await expect(page.locator('//span[text()="Liked"]').nth(1)).toBeVisible();
  expect(timeText).toStrictEqual('Just now');
  console.log("Post is liked in Chatter. Verified")
})


