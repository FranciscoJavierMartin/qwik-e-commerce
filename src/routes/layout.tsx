import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import NavbarTop from '~/components/NavbarTop';
import { type Store } from '~/utils/store';
import { supabaseClient } from '~/utils/supabase';

export const STORE_CONTEXT = createContextId<Store>('STORE_CONTEXT');

const initialData: Store = {
  cart: {
    products: [],
  },
};

export const useUser = routeLoader$(async (requestEv) => {
  const supabaseAccessToken = requestEv.cookie.get('supabase_access_token');

  if (!supabaseAccessToken) {
    return null;
  }

  const { data, error } = await supabaseClient.auth.getUser(
    supabaseAccessToken.value,
  );

  return error ? null : data.user;
});

export default component$(() => {
  const store = useStore<Store>(initialData, { deep: true });
  useContextProvider(STORE_CONTEXT, store);

  return (
    <div>
      <NavbarTop />
      <Slot />
    </div>
  );
});
