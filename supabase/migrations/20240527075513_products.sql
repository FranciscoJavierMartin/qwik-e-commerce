drop table IF EXISTS public.test;

create table public.products (
  id bigint generated by default as identity,
  name text null,
  description text null,
  price double precision null,
  image text null,
  constraint products_pkey primary key (id)
) tablespace pg_default;