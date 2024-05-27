import { component$ } from '@builder.io/qwik';
import {
  routeLoader$,
  useNavigate,
  type DocumentHead,
} from '@builder.io/qwik-city';
import { supabaseClient } from '~/utils/supabase';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
};

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

export const useProducts = routeLoader$(async () => {
  const { data } = await supabaseClient.from('products').select('*');
  return data as Product[];
});

export default component$(() => {
  const userSig = useUser();
  const productsSig = useProducts();
  const navigate = useNavigate();

  return (
    <div>
      {productsSig.value.map((product) => (
        <div key={product.id}>
          <div>
            <div>
              <img
                loading='eager'
                width={280}
                height={280}
                src={`/images/${product.image}`}
                alt={product.name}
              />
            </div>
          </div>
          <div>
            <span>{product.name}</span>
            <div>{product.description}</div>
            <div>
              <span>$ {product.price}</span>
              {userSig.value ? (
                <button type='button' class=''
                onClick$={() => {console.log('Add to cart')}}>
                  <IconShoppingCart/>
                  Add to cart
                  </button>
              ):(
                <button type='button' class='' onClick$={() => navigate('/sign-in')}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
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
