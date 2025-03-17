//Import Playwright Module
import { test, expect } from '@playwright/test'
import { SalesForceLogin, Entry} from '../../test-data/Marathon1/data.json'
//Write a Test
test('New Lead Creation', async ({ page }) => {
  const user = SalesForceLogin.userName;
  const pwd = SalesForceLogin.pwd;
  const fname = Entry.fname;
  const lname = Entry.lname;
  const Company = Entry.Company;
  const opportunity_Name = Entry.opportunity_Name;
  test.setTimeout(120000);
  //1 and 2. Goto URL

  await page.goto('https://login.salesforce.com/');
  //3.Login
  await page.locator('#username').fill(user);
  await page.locator('#password').fill(pwd);
  await page.locator('input#Login').click();
  //4.Click on the App Launcher toggle button
  await page.locator('div.slds-icon-waffle').click({timeout:20000});
  //5.Click on the View All link.  
  await page.locator('button[aria-label="View All Applications"]').click();
  //6.Type ‘Marketing’ in the search box and click on the Marketing link. 
  let inputBox = await page.getByPlaceholder('Search apps or items...');
  inputBox.fill("Marketing");
  inputBox.press('Enter');
  //await page.locator('p.slds-truncate').waitFor({state:'visible'})
 
  //page.waitForTimeout({ timeout: 360000 });
  const loadingIcon=page.locator('lightning-spinner').nth(0)
  await loadingIcon.waitFor({ state: 'hidden', timeout:50000 });
  const marketingLocator = page.locator('[data-name=\'Marketing CRM Classic\']').first();
  await expect(marketingLocator).toBeVisible()
  await marketingLocator.click({ timeout: 80000 });
  //7.Navigate to the Leads tab from the Marketing dashboard. 
  await page.locator('a[title=\'Leads\']').click({timeout: 80000});
  //8.Click on the New button to create a lead. 
  await page.waitForLoadState('domcontentloaded', {timeout:99000});
  //await page.waitForTimeout(360000);
  const createNewLead = page.locator('button[name=\'New\']');
  if (await createNewLead.count() <= 0) {
    await expect(page.locator(' a>div[title=\'New\']')).toBeVisible({ timeout: 50000 });
    await page.locator(' a>div[title=\'New\']').click({ timeout: 80000 });
  }
  else { 
    await expect(createNewLead).toBeVisible({timeout:50000});
    page.waitForLoadState('domcontentloaded', { timeout: 99000 });
    
    await createNewLead.click({timeout:80000});

  }
  //9.Fill in all the mandatory fields (Salutation, First Name, Last Name, Company) with valid data.
  await page.getByPlaceholder('Last Name').fill(lname);
  await page.locator('input.slds-input[name=\'Company\']').fill(Company);
  await page.getByRole('combobox', { name: 'salutation' }).click({ timeout: 2000 });
  await page.locator('[data-value="Ms."]').click();
  await page.locator('//input[@name=\'firstName\']').fill(fname);
  //10.Save, A confirmation message should also be displayed and verified. 
  await page.locator('//button[@name=\'SaveEdit\']').click({timeout: 2000});
  const tOastMsg = await page.locator('.toastMessage.slds-text-heading--small.forceActionsText').textContent();
  console.log(tOastMsg);
  const expectedText = `Lead "Ms. ${fname + " " + lname}" was created.`;
  expect(tOastMsg).toStrictEqual(expectedText);
  // Toast msg: Lead "Ms. firstname lastname" was created.
  //11.In the newly created Lead page, locate the dropdown near Submit for Approval button and click on the Convert link. 
  
  const dropDownButton = page.locator('li.slds-dropdown-trigger.slds-dropdown-trigger_click.slds-button_last.overflow button').nth(0);
  await expect(dropDownButton).toBeVisible({timeout:50000})
  await dropDownButton.click();
  await page.locator('runtime_platform_actions-action-renderer[title=\'Convert\']').click({timeout:50000});
  //12. Click on the Opportunity Name input field, clear and enter a new opportunity name. 
  await page.locator('span[title=\'Opportunity\']').click();
  const opportunity_Input = page.locator('label + input').nth(3);
  await opportunity_Input.clear();
  await opportunity_Input.fill(opportunity_Name);

//   13.Step: Click on the Convert button.
  // Expected Result: The lead should be successfully converted. A confirmation message ‘Your lead has been converted’ should be displayed and verified.
  await page.locator('//button[text()=\'Convert\']').click();
  await expect(page.locator('[class*=\'leadConvertedConfirmationDesktop\']')).toBeVisible({timeout:50000});
  const convertionMsg = page.locator('.header h2').nth(1);
  expect(convertionMsg).toHaveText(`Your lead has been converted`);
  console.log(await convertionMsg.textContent());
  //14.Click on the Go to Leads button. 
  await page.locator('//button[text()=\'Go to Leads\']').click();
  
  // 15.Step: Search the verified lead name in the Search box and verify the text ‘No items to display’. 
  const listView = page.locator('//button[text()=\'List View\']').nth(0);
  if ((await listView.count()) > 0) {
    await listView.click({ timeout: 50000 });
}
  const leadSearchBox = page.locator('[name=\'Lead-search-input\']')
  await leadSearchBox.fill(`${fname + " " + lname}`)
  await leadSearchBox.press('Enter', { timeout: 50000 });
  await page.locator('lightning-spinner').nth(1).waitFor({ state: 'hidden', timeout:50000 });
  await page.waitForSelector('//span[text()=\'No items to display.\']', { state: 'attached', timeout:80000});
  const NoItemsMsg = await page.locator('//span[text()=\'No items to display.\']').textContent();
  expect(NoItemsMsg).toStrictEqual('No items to display.')
 console.log(`After searching Lead the message displayed is  ${NoItemsMsg}`)

// 16. Step: Navigate to the Opportunities tab and search for the opportunity linked with the converted lead.
// Expected Result: The newly converted opportunity should appear in the list with all the relevant
// details correctly populated from the lead.

  await page.locator('//a[@title="Opportunities"]').click({ timeout: 50000 });
  const opportunity_search = page.locator('//input[@name="Opportunity-search-input"]');
  await opportunity_search.fill(opportunity_Name);
  await opportunity_search.press('Enter', { timeout: 50000 });
  expect(await page.locator('tbody>tr').count()).toBeGreaterThanOrEqual(1);
  console.log(`Matching rows of the opportunity is/are ${await page.locator('tbody>tr').count()}`)
  const opportunityText_result = await page.locator('tbody>tr th a').nth(0).textContent();
  console.log(`Opportunity name: ${opportunityText_result}`);
  expect(opportunityText_result).toStrictEqual(opportunity_Name);
})

