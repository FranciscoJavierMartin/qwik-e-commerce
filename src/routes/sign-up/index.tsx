import { component$, useSignal } from '@builder.io/qwik';
import { supabaseClient } from '~/utils/supabase';

export default component$(() => {
  const emailSig = useSignal<string>('');
  const passwordSig = useSignal<string>('');
  const messageSig = useSignal<string>('');

  return (
    <div>
      <label for='email'>Your email</label>
      <input
        type='email'
        id='email'
        value={emailSig.value}
        onInput$={(_, el) => {
          emailSig.value = el.value;
        }}
      />
      <label for='password'>Password</label>
      <input type='password' id='password' bind:value={passwordSig} />
      {!!messageSig.value && <div>{messageSig.value}</div>}
      <button
        onClick$={async () => {
          const { error } = await supabaseClient.auth.signUp({
            email: emailSig.value,
            password: passwordSig.value,
          });
          messageSig.value = error
            ? 'Error'
            : 'Success. Please check your email/span folder';
        }}
      >
        Sign up
      </button>
    </div>
  );
});
