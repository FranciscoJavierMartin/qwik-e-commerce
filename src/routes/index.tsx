import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
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
  const useSig = useUser();
  return (
    <>
      <h1>Hi from Supabase👋</h1>
      <h2>Welcome {useSig.value ? useSig.value.email : 'guest'}</h2>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};
