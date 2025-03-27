import { Locator, Page } from 'playwright';
import { createParser } from 'css-selector-parser';
import { Actor, ChanceOptions } from './Actor';
import { setupBrowser, teardownBrowser } from '../utility';
import { expect } from '@playwright/test';

interface ISwagDetails {
  name: string;
  username?: string;
  password?: string;
}

// destructure the environment variables for the Swag Labs username and password
const { QAT_PW_SWAG_USERNAME: swagUser, QAT_PW_SWAG_PASSWORD: swagPass } =
  process.env;

// create a CSS parser with strict mode enabled, helps catch badly formatted selectors, this would be better as a type but we at least catch this early during runtime
const parseCss = createParser({ strict: true });

/**
 * A SwagActor is an Actor that can interact with the Swag Labs website.
 *
 * We're using a content driven selection approach to minimise the need for selectors and to avoid intercepting network requests.
 */
export class SwagActor extends Actor {
  private page: Page;
  private _ancestor: string;

  username: string;
  password: string;

  constructor(details: ISwagDetails, chanceOptions?: ChanceOptions) {
    super(details.name, chanceOptions);

    this.username = details.username || swagUser;
    this.password = details.password || swagPass;
  }

  /** Shorthand method to return a locator */
  private get A(): Locator {
    return this.page.locator(this._ancestor);
  }

  /** Gets the common ancestor used to scope PlayWright wrappers */
  public get ancestor(): string {
    return this._ancestor;
  }

  /** Sets the common ancestor used to scope PlayWright wrappers */
  public set ancestor(selector: string) {
    parseCss(selector);
    this._ancestor = selector;
  }

  /** Opens a browser and sets the page property of the actor */
  async opensBrowser() {
    this.page = await setupBrowser();
  }

  /** Closes the browser using the page property of the actor */
  async closesBrowser() {
    await teardownBrowser(this.page);
  }

  /** Wraps {@link Page.goto} */
  async visits(url: string) {
    await this.page.goto(url);
  }

  /** Wraps {@link Page.getByPlaceholder} to find matching inputs */
  async typesInput(placeholder: string, value: string) {
    await this.A.getByPlaceholder(placeholder).fill(value);
  }

  /** Wraps {@link Page.getByRole} and matches the provided content to the element's accessibility name */
  async clicksButton(content: string) {
    await this.A.getByRole('button', { name: content }).click();
  }

  /** Wraps {@link Page.getByText} in order to click the given content */
  async clicksContent(content: string) {
    await this.A.getByText(content).click();
  }

  /** Wraps {@link Page.locator} to directly click the shopping cart icon */
  async clicksShoppingCartIcon() {
    await this.A.locator('[data-icon="shopping-cart"]').click();
  }

  /** Wraps {@link Page.getByLabel} to find a matching inventory item */
  async addsProductToCart(product: string) {
    await this.A.locator('.inventory_item', { hasText: product })
      .getByText('Add to cart')
      .click();
  }

  /**
   * Wraps {@link Page.locator} and uses a `shopping_cart_badge` class to assert on shopping cart badge
   *
   * Note: this query is **not** scoped to a common ancestor
   */
  async seesCartBadgeCount(count: string) {
    await expect(this.page.locator('.shopping_cart_badge')).toHaveText(count);
  }

  /**
   * Wraps {@link Page.locator} and filters by matching the product name, asserting visibility, item price, and quantity
   */
  async seesCartItem(item: {
    qty: number;
    product: { name: string; price: number };
  }) {
    const cartItem = this.A.locator('.cart_item', {
      hasText: item.product.name,
    });
    const itemPrice = cartItem.locator('.inventory_item_price');
    const itemQty = cartItem.locator('[class*="quantity"]');

    await expect(cartItem).toBeVisible();
    await expect(itemPrice).toContainText(`${item.product.price}`);
    await expect(itemQty).toContainText(`${item.qty}`);
  }

  /**
   * Wraps {@link Page.getByText} to assert that content is visible
   *
   * Note: this query is **not** scoped to a common ancestor
   */
  async seesContent(content: string) {
    await expect(this.page.getByText(content)).toBeVisible();
  }

  /**
   * Wraps {@link Page.locator} and uses a `data-icon` attribute to assert on shopping cart icon
   *
   * Note: this query is **not** scoped to a common ancestor
   */
  async seesShoppingCartIcon() {
    await expect(
      this.page.locator('svg[data-icon="shopping-cart"]'),
    ).toBeVisible();
  }

  /**
   * Wraps {@link Page.locator} and grabs all of the different cart totals to assert on them
   */
  async seesCartTotals(totals: {
    itemTotal: number;
    taxTotal: number;
    grandTotal: number;
  }) {
    const itemTotal = this.page.locator('.summary_subtotal_label');
    const taxTotal = this.page.locator('.summary_tax_label');
    const grandTotal = this.page.locator('.summary_total_label');

    await expect(itemTotal).toHaveText(`Item total: $${totals.itemTotal}`);
    await expect(taxTotal).toHaveText(`Tax: $${totals.taxTotal}`);
    await expect(grandTotal).toHaveText(`Total: $${totals.grandTotal}`);
  }

  /** Wraps {@link Page.getByPlaceholder} and asserts on the current value */
  async seesInputWithValue(placeholder: string, value: string) {
    await expect(this.page.getByPlaceholder(placeholder)).toHaveValue(value);
  }
}
