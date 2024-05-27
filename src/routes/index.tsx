import { $, component$, useSignal } from '@builder.io/qwik';
import {
  routeLoader$,
  server$,
  useNavigate,
  type DocumentHead,
} from '@builder.io/qwik-city';
import type { Orama } from '@orama/orama';
import { create, insert, search } from '@orama/orama';
import { supabaseClient } from '~/utils/supabase';
import { IconShoppingCart } from '~/components/icons/IconShoppingCart';
import { useUser } from './layout';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

let oramaDb: Orama;

export const useProducts = routeLoader$(async () => {
  const { data } = await supabaseClient.from('products').select('*');

  oramaDb = await create({
    schema: {
      id: 'string',
      name: 'string',
      description: 'string',
      price: 'number',
      image: 'string',
    },
  });

  if (data) {
    await Promise.all(
      data.map(async (product: Product) =>
        insert(oramaDb, { ...product, id: product.id.toString() }),
      ),
    );
  }

  return data as Product[];
});

export const execSearch = server$(async (term: string) => {
  const response = await search(oramaDb, {
    term,
    properties: '*',
    boost: { name: 1.5 },
    tolerance: 2,
  });

  return response;
});

export default component$(() => {
  const termSig = useSignal<string>('');
  const navigate = useNavigate();
  const productsSig = useProducts();
  const userSig = useUser();
  const resultsSig = useSignal<Product[]>(productsSig.value);

  const onSearch = $(async (term: string) => {
    if (!term) {
      resultsSig.value = productsSig.value;
    } else {
      const response = await execSearch(term);
      resultsSig.value = response.hits.map(
        (hit) => hit.document as unknown as Product,
      );
    }
  });

  return (
    <div class='flex flex-col items-center p-4'>
      <div class='w-[400px] py-4'>
        <label class='mb-2 block text-center text-lg font-medium text-gray-600'>
          Search - eg. plant, water, hot
        </label>
        <input
          type='text'
          class='block w-full rounded-lg border-gray-300 bg-gray-50 p-2 text-gray-600'
          placeholder='Search'
          bind:value={termSig}
          onKeyDown$={(e) => {
            if (e.key === 'Enter') {
              onSearch(termSig.value);
            }
          }}
        />
      </div>
      <div class='mx-auto mt-8 flex max-w-[1000px] flex-wrap items-center justify-between gap-4'>
        {resultsSig.value.map((product) => (
          <div
            key={product.id}
            class='w-[280px] min-w-[280px] max-w-[280px] flex-auto flex-shrink-0 rounded-md border border-neutral-200 hover:shadow-lg'
          >
            <div class='relative'>
              <div class='relative block w-[280px] p-1 text-blue-700 underline hover:text-blue-800 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-offset-0 active:text-blue-900'>
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
            <div class=' border-t border-neutral-200 px-6 py-4 text-sm'>
              <span class='text-base font-bold text-gray-900 no-underline hover:text-blue-800 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-offset-0 active:text-blue-900'>
                {product.name}
              </span>
              <div class='h-[120px] text-gray-600 no-underline hover:text-blue-800 focus-visible:rounded-sm focus-visible:outline focus-visible:outline-offset-0 active:text-blue-900'>
                {product.description}
              </div>
              <p class='block py-2 text-justify text-xs font-normal text-neutral-700'></p>
              <div class='flex items-center justify-between'>
                <span class='block text-sm font-bold'>$ {product.price}</span>
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
