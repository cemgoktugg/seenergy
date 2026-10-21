-- Points every stored address at the CURRENT domains. Runs on every deploy
-- (the db-urls service in docker-compose.yml), after Postgres is up and
-- before the backend starts. Only replaces; never deletes. A run with
-- nothing to change changes nothing.
--
-- Medusa stores absolute URLs. The data has carried, over its life:
--   http://localhost:3100 / http://localhost:9000   development
--   https://onlinehesap.net / https://api.onlinehesap.net   first live domain
--     (its DNS never resolved; the store moved to ecommercore.com.tr while
--      that database was already in use, so it kept these addresses)
-- Add a domain here if the store ever moves again.
--
--   psql -v store=https://ecommercore.com.tr -v api=https://api.ecommercore.com.tr -f deploy/sync-urls.sql

select set_config('seenergy.store', :'store', false),
       set_config('seenergy.api', :'api', false);

do $$
declare
  store text := current_setting('seenergy.store');
  api text := current_setting('seenergy.api');
  -- previous origin → which current origin replaces it. API hosts first, so
  -- https://api.X is not caught by the shorter https://X rule.
  pairs text[][] := array[
    ['http://localhost:9000', 'api'],
    ['https://api.onlinehesap.net', 'api'],
    ['http://localhost:3100', 'store'],
    ['https://www.onlinehesap.net', 'store'],
    ['https://onlinehesap.net', 'store']
  ];
  r record;
  i int;
  target text;
  changed int;
  total int := 0;
begin
  for r in
    select c.table_name, c.column_name, c.data_type
    from information_schema.columns c
    join information_schema.tables t using (table_schema, table_name)
    where c.table_schema = 'public'
      and t.table_type = 'BASE TABLE'
      and c.data_type in ('text', 'character varying', 'json', 'jsonb')
  loop
    for i in 1 .. array_length(pairs, 1) loop
      target := case pairs[i][2] when 'api' then api else store end;
      continue when pairs[i][1] = target;
      execute format(
        'update %I set %I = replace(%I::text, %L, %L)::%s where %I::text like %L',
        r.table_name, r.column_name, r.column_name, pairs[i][1], target,
        r.data_type, r.column_name, '%' || pairs[i][1] || '%'
      );
      get diagnostics changed = row_count;
      if changed > 0 then
        raise notice '%.%: % satır (% → %)', r.table_name, r.column_name, changed, pairs[i][1], target;
        total := total + changed;
      end if;
    end loop;
  end loop;
  raise notice 'Adres eşitleme: toplam % satır güncellendi.', total;
end $$;
