import { component$, Slot } from '@builder.io/qwik';
import NavbarTop from '~/components/NavbarTop';

export default component$(() => {
  return (
    <div>
      <NavbarTop />
      <Slot />
    </div>
  );
});
