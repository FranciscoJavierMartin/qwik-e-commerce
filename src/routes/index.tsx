import { component$ } from '@builder.io/qwik';
import {
  routeLoader$,
  useNavigate,
  type DocumentHead,
} from '@builder.io/qwik-city';
import { supabaseClient } from '~/utils/supabase';
import { useUser } from './layout';
import { IconShoppingCart } from '~/components/icons/IconShoppingCart';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

export const useProducts = routeLoader$(async () => {
  const { data } = await supabaseClient.from('products').select('*');
  return data as Product[];
});

export default component$(() => {
  const userSig = useUser();
  const productsSig = useProducts();
  const navigate = useNavigate();

  return (
    <div class='flex flex-col items-center p-4'>
      <div class='mx-auto mt-8 flex max-w-[1000px] flex-wrap items-center justify-between gap-4'>
        {productsSig.value.map((product) => (
          <div
            key={product.id}
            class='w-[280px] min-w-[280px] max-w-[280px] flex-auto flex-shrink-0 rounded-md border border-neutral-200 hover:shadow-lg'
          >
            <div class='relative'>
              <div class='focus-visible:outline-offset-0 relative block w-[280px] p-1 text-blue-700 underline hover:text-blue-800 focus-visible:rounded-sm focus-visible:outline active:text-blue-900'>
                <img
                  loading='eager'
                  width={280}
                  height={280}
                  src={`/images/${product.image}`}
                  alt={product.name}
                  class='aspect-square size-full rounded-md object-cover'
                />
              </div>
            </div>
            <div class='text-sm border-t border-neutral-200 px-6 py-4'>
              <span class='focus-visible:outline-offset-0 text-base font-bold text-gray-900 no-underline hover:text-blue-800 focus-visible:rounded-sm focus-visible:outline active:text-blue-900'>{product.name}</span>
              <div class='focus-visible:outline-offset-0 h-[120px] text-gray-600 no-underline hover:text-blue-800 focus-visible:rounded-sm focus-visible:outline active:text-blue-900'>{product.description}</div>
              <p class='text-xs block py-2 text-justify font-normal text-neutral-700'></p>
              <div class='flex items-center justify-between'>
                <span class='text-sm block font-bold'>$ {product.price}</span>
                {userSig.value ? (
                  <button
                    type='button'
                    class={[
                      'inline-flex items-center justify-center font-medium',
                      'focus-visible:outline-offset disabled:text-disabled-500 rounded-md focus-visible:outline',
                      'disabled:bg-disabled-300 leading-5 disabled:cursor-not-allowed disabled:shadow-none disabled:ring-0',
                      'gap-1.5 px-3 py-1.5 text-sm text-white shadow hover:shadow-md active:shadow',
                      'disabled:bg-disabled-300 bg-blue-700 hover:bg-blue-800 active:bg-blue-900',
                    ]}
                    onClick$={() => {
                      console.log('Add to cart');
                    }}
                  >
                    <IconShoppingCart />
                    Add to cart
                  </button>
                ) : (
                  <button
                    type='button'
                    class={[
                      'inline-flex items-center justify-center font-medium',
                      'focus-visible:outline-offset disabled:text-disabled-500 rounded-md focus-visible:outline',
                      'disabled:bg-disabled-300 leading-5 disabled:cursor-not-allowed disabled:shadow-none disabled:ring-0',
                      'gap-1.5 px-3 py-1.5 text-sm text-white shadow hover:shadow-md active:shadow',
                      'disabled:bg-disabled-300 bg-blue-700 hover:bg-blue-800 active:bg-blue-900',
                    ]}
                    onClick$={() => navigate('/sign-in')}
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Qwik e-commerce',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
