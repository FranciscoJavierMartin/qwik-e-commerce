import { component$, Slot } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import NavbarTop from '~/components/NavbarTop';
import { supabaseClient } from '~/utils/supabase';

export const useUser = routeLoader$(async (requestEv) => {
  const supabaseAccessToken = requestEv.cookie.get('supabase_access_token');

  if (!supabaseAccessToken) {
    return null;
  }

  const { data, error } = await supabaseClient.auth.getUser(
    supabaseAccessToken.value
  );

  return error ? null : data.user;
});

export default component$(() => {
  return (
    <div>
      <NavbarTop />
      <Slot />
    </div>
  );
});
