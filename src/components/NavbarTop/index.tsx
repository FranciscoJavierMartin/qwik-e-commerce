import { component$ } from '@builder.io/qwik';
import Logo from '~/assets/qwik.svg?jsx';

export default component$(() => {
  return (
    <header
      data-testid='navbar-top'
      class='z-50 flex h-14 bg-blue-700 text-white md:sticky md:-top-5 md:h-20 md:pt-2.5 md:shadow-md'
    >
      <div class='max-w-screen-2xl sticky top-0 mx-auto flex w-full items-center gap-[clamp(1rem,3vw,3rem)] px-4 py-6 md:h-[60px] md:px-6 lg:px-10'>
        <Logo class='mt-1 size-12' />
        <div class='flex justify-center text-3xl font-bold w-full'>
          Qwik e-commerce
        </div>
        <div class='w-12' />
      </div>
    </header>
  );
});
