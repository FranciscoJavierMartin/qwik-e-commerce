import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { PostgrestSingleResponse } from '@supabase/supabase-js';
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
  return <div></div>;
});
