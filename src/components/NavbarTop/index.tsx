import { component$, useComputed$, useContext } from '@builder.io/qwik';
import Logo from '~/assets/qwik.svg?jsx';
import { STORE_CONTEXT } from '~/routes/layout';
import { type Store } from '~/utils/store';

export function getCartQuantity(cart: Store['cart']): number {
  return cart.products.reduce((total, item) => total + item.quantity, 0);
}

export default component$(() => {
  const store = useContext(STORE_CONTEXT);
  const cartQuantitySig = useComputed$(() => getCartQuantity(store.cart));

  return (
    <header
      data-testid='navbar-top'
      class='z-50 flex h-14 bg-blue-700 text-white md:sticky md:-top-5 md:h-20 md:pt-2.5 md:shadow-md'
    >
      <div class='sticky top-0 mx-auto flex w-full max-w-screen-2xl items-center gap-[clamp(1rem,3vw,3rem)] px-4 py-6 md:h-[60px] md:px-6 lg:px-10'>
        <Logo class='mt-1 size-12' />
        <div class='flex w-full justify-center text-3xl font-bold'>
          Qwik e-commerce
        </div>
        <div class='w-12' />
      </div>
    </header>
  );
});
