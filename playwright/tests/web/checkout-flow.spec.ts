import { test } from '@playwright/test';
import { swagConfig } from '../../../playwright.config';
import { SwagActor } from '../../actors';

const productData = {
  backpack: {
    name: 'Sauce Labs Backpack',
    price: 29.99,
  },
  bikeLight: {
    name: 'Sauce Labs Bike Light',
    price: 9.99,
  },
  boltTShirt: {
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
  },
  fleeceJacket: {
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
  },
  onesie: {
    name: 'Sauce Labs Onesie',
    price: 7.99,
  },
  redTShirt: {
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
  },
};

const products = Object.values(productData).map((v) => v);

const hubert = new SwagActor(
  { name: 'Hubert Farnsworth' },
  {
    // with more time we could use an approach like this to define the test data as part of the actor and
    // dynamically generate test functions with predefined parameters i.e. pickoneProduct using matching Chance methods
    products: {
      method: 'pickone',
      suffix: 'Product',
      options: products,
    },
  },
);

// use the swag config for testing Swag Labs web client
test.use({ baseURL: swagConfig.baseUrl });

// we run this test serially as there's very little cleanup or complexity involved here
test.describe.configure({ mode: 'serial' });

test.describe(
  'Hubert visits SwagLabs, logs in, and completes the checkout flow with random products',
  { tag: '@web' },
  () => {
    const firstName = hubert.name.split(' ')[0];
    const lastName = hubert.name.split(' ')[1];
    const postcode = hubert.postcode();

    // this works around a current bug on the Sauce Labs website, can safely remove slices once fixed
    const firstProduct = hubert.pickone(products.slice(0, 2));
    const secondProduct = hubert.pickone(products.slice(2, 4));
    const thirdProduct = hubert.pickone(products.slice(4, 6));

    test.beforeAll(async () => {
      await hubert.opensBrowser();
    });

    test.afterAll(async () => {
      await hubert.closesBrowser();
    });

    test('logs in to the platform', async () => {
      hubert.ancestor = '.login_wrapper';
      await hubert.visits('v1');
      await hubert.typesInput('Username', hubert.username);
      await hubert.typesInput('Password', hubert.password);
      await hubert.clicksButton('Login');
      await hubert.seesShoppingCartIcon();
      await hubert.seesContent('Products');
    });

    test('adds some random products to the cart and confirms badge count', async () => {
      hubert.ancestor = '#inventory_container';
      await hubert.addsProductToCart(firstProduct.name);
      await hubert.addsProductToCart(secondProduct.name);
      await hubert.addsProductToCart(thirdProduct.name);
      await hubert.seesCartBadgeCount('3');
    });

    test('navigates to cart and confirms item quantities and prices are correct', async () => {
      hubert.ancestor = '#contents_wrapper';
      await hubert.clicksShoppingCartIcon();
      await hubert.seesContent('Your Cart');
      await hubert.seesCartItem({ qty: 1, product: firstProduct });
      await hubert.seesCartItem({ qty: 1, product: secondProduct });
      await hubert.seesCartItem({ qty: 1, product: thirdProduct });
      await hubert.clicksContent('CHECKOUT');
    });

    test('enters first name, lastname, and postcode before continuing', async () => {
      await hubert.seesContent('Checkout: Your Information');
      await hubert.typesInput('First Name', firstName);
      await hubert.typesInput('Last Name', lastName);
      await hubert.typesInput('Postal Code', postcode);
      await hubert.seesInputWithValue('First Name', firstName);
      await hubert.seesInputWithValue('Last Name', lastName);
      await hubert.seesInputWithValue('Postal Code', postcode);
      await hubert.clicksContent('Continue');
    });

    test('confirms item quantities and prices are correct in cart overview', async () => {
      await hubert.seesContent('Checkout: Overview');
      await hubert.seesCartItem({ qty: 1, product: firstProduct });
      await hubert.seesCartItem({ qty: 1, product: secondProduct });
      await hubert.seesCartItem({ qty: 1, product: thirdProduct });
    });

    test('confirms item total and total including tax is correct', async () => {
      const itemTotal =
        firstProduct.price + secondProduct.price + thirdProduct.price;
      // tested a few different cart item combinations and it seems like 0.8% is the tax rate
      const taxTotal = Math.round(itemTotal * 0.08 * 100) / 100;
      const grandTotal = itemTotal + taxTotal;

      await hubert.seesCartTotals({ itemTotal, taxTotal, grandTotal });
    });

    test('completes the checkout flow and sees confirmation message', async () => {
      await hubert.clicksContent('Finish');
      await hubert.seesContent('Finish');
      await hubert.seesContent('Thank you for your order');
    });
  },
);
