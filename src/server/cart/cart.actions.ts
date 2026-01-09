import {
  clearDbCart,
  createDbCartItem,
  getDbCartItem,
  getDbCartItems,
  removeFromDbCart,
  updateDbCartItemQuantity,
} from "./cart.db";

export const getCartItems = async () => {
  const cart = await getDbCartItems();

  return {
    items: cart.map(item => ({
      ...item.products,
      quantity: item.cart_items.quantity,
    })),
  };
};

export async function removeFromCart(productId: string) {
  await removeFromDbCart(productId);
}

export async function clearCart() {
  await clearDbCart();
}

export async function updateCartItem(productId: string, quantity: number = 1) {
  const qty = Math.max(0, Math.min(quantity, 99));

  if (qty === 0) {
    // delete the item
    await removeFromDbCart(productId);
  } else {
    // check if an item already exists in the cart
    const existingItem = await getDbCartItem(productId);

    // if item exists, update quantity
    if (existingItem.length > 0) await updateDbCartItemQuantity(productId, qty);
  }
}

export async function addToCart(productId: string, quantity: number = 1) {
  const qty = Math.max(1, Math.min(quantity, 99));

  // check if an item already exists in the cart
  const existingItem = await getDbCartItem(productId);

  // if exists update quanity
  if (existingItem.length > 0) {
    await updateCartItem(productId, existingItem[0].quantity + qty);
  } else {
    // insert a new item
    await createDbCartItem(productId, qty);
  }
}
