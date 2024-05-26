import { component$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';
import { createServerClient } from 'supabase-auth-helpers-qwik';

type TestRow = {
  id: number;
  created_at: string;
  test_column: string;
};

export const useTestTable = routeLoader$(async (requestEv) => {
  const supabaseClient = createServerClient(
    requestEv.env.get('VITE_SUPABASE_URL')!,
    requestEv.env.get('VITE_SUPABASE_ANON_KEY')!,
    requestEv
  );

  const { data } = await supabaseClient.from('test').select('*');
  console.log(data);
  return data as TestRow[];
});

export default component$(() => {
  const testTableRows = useTestTable();
  return (
    <>
      <h1>Hi from Supabase👋</h1>
      {testTableRows.value.map((row) => (
        <div key={row.id}>{row.test_column}</div>
      ))}
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
