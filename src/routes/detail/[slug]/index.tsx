import { component$ } from '@builder.io/qwik';
import { routeLoader$, useNavigate } from '@builder.io/qwik-city';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
import { HeartIcon } from '~/components/icons/HeartIcon';
import { IconShoppingCart } from '~/components/icons/IconShoppingCart';
import { useUser } from '~/routes/layout';
import type { Product } from '~/utils/store';
import { supabaseClient } from '~/utils/supabase';

export const useProductDetail = routeLoader$(async ({ params, status }) => {
  const slug = params.slug;
  const { data }: PostgrestSingleResponse<Product[]> = await supabaseClient
    .from('products')
    .select('*')
    .eq('slug', slug);

  if (!data) {
    status(404);
  }

  return data ? data[0] : null;
});

export default component$(() => {
  const navigate = useNavigate();
  const userSig = useUser();
  const productDetail = useProductDetail();

  return !productDetail.value ? (
    <div>Sorry, looks like we don't have this product.</div>
  ) : (
    <div>
      <div class='mx-auto max-w-6xl px-4 py-10'>
        <div>
          <h2 class='my-8 text-3xl font-light tracking-tight text-gray-900 sm:text-5xl'>
            {productDetail.value.name}
          </h2>
          <div class='mt-4 md:mt-12 lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8'>
            <div class='mx-auto w-full max-w-2xl sm:block lg:max-w-none'>
              <span class='overflow-hidden rounded-md'>
                <div class='h-[400px] w-full md:w-[400px]'>
                  <img
                    loading='eager'
                    width={400}
                    height={400}
                    src={`/images/${productDetail.value.image}`}
                    alt={productDetail.value.name}
                    class='aspect-square size-full rounded-md object-cover'
                  />
                </div>
              </span>
            </div>
            <div class='mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0'>
              <div>
                <h3 class='sr-only'>Description</h3>
                <div
                  class='text-base text-gray-700'
                  dangerouslySetInnerHTML={productDetail.value.description}
                />
              </div>
              <div class='mt-10 flex flex-col sm:flex-row sm:items-center'>
                $ {productDetail.value.price}
                <div class='flex px-4 align-baseline sm:flex-col'>
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
                  <button
                    type='button'
                    class='ml-4 flex items-center justify-center rounded-md p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500'
                  >
                    <HeartIcon />
                    <span class='sr-only'>Add to favorites</span>
                  </button>
                </div>
              </div>
              <section class='mt-12 border-t pt-12 text-xs'>
                <h3 class='mb-2 font-bold text-gray-600'>Shipping & returns</h3>
                <div class='space-y-1 text-gray-500'>
                  <p>
                    Standard shipping: 3 - 5 working days. Express shipping: 1 -
                    3 working days.
                  </p>
                  <p>
                    Shipping costs depend on delivery address and will be
                    calculated during checkout.
                  </p>
                  <p>
                    Returns are subject to terms. Please see the{' '}
                    <span class='underline'>returns page</span> for further
                    information.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
