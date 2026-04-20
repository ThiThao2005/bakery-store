-- 1) Co bao nhieu san pham?
select count(*) as products_count from public.products;

-- 2) Xem nhanh du lieu
select id, name, price, created_at
from public.products
order by created_at desc nulls last, id desc
limit 20;

-- 3) Kiem tra RLS dang bat hay tat
select c.relname as table_name, c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('products');

-- 4) Liet ke policy hien tai tren products
select policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'products';

-- 5) Bat RLS (neu chua bat)
alter table public.products enable row level security;

-- 6) Dam bao policy doc public cho danh sach san pham
-- Neu policy da co thi bo qua.
do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'products'
      and policyname = 'Public can read products'
  ) then
    create policy "Public can read products"
      on public.products
      for select
      to anon, authenticated
      using (true);
  end if;
end $$;

-- 7) Neu chua co du lieu thi seed nhanh 2 dong
do $$
begin
  if not exists (select 1 from public.products limit 1) then
    insert into public.products (name, price, image_url, description, category)
    values
      (
        'Strawberry Cake',
        18,
        'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80',
        'Banh kem dau tay voi cot banh mem va lop kem tuoi.',
        'Cake'
      ),
      (
        'Chocolate Donut',
        4,
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
        'Donut chocolate phu duong ngot vua.',
        'Donut'
      );
  end if;
end $$;

-- 8) Verify sau khi sua
select count(*) as products_count_after_fix from public.products;
select id, name, price from public.products order by id desc limit 20;
