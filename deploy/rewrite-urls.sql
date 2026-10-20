-- Rewrites the development addresses stored in the database to the live ones.
--
-- Medusa stores absolute URLs: seeded product pictures point at the
-- storefront (http://localhost:3100/mock/...), pictures uploaded in the admin
-- at the backend (http://localhost:9000/static/...). After restoring
-- seenergy.sql on the server, run once:
--
--   psql "$DATABASE_URL" \
--     -v store=https://www.ORNEK.com.tr \
--     -v api=https://api.ORNEK.com.tr \
--     -f deploy/rewrite-urls.sql
--
-- (no trailing slash). It touches every text/json column in the public schema
-- that still contains "localhost:", so nothing is missed — product.thumbnail,
-- image.url, vitrin_block.data and the search index among them. Safe to run
-- again: a second run finds nothing to change.

select set_config('seenergy.store', :'store', false),
       set_config('seenergy.api', :'api', false);

do $$
declare
  r record;
  store text := current_setting('seenergy.store');
  api text := current_setting('seenergy.api');
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
    execute format(
      'update %I set %I = replace(replace(%I::text, %L, %L), %L, %L)::%s where %I::text like %L',
      r.table_name, r.column_name, r.column_name,
      'http://localhost:3100', store,
      'http://localhost:9000', api,
      r.data_type, r.column_name, '%localhost:%'
    );
    get diagnostics changed = row_count;
    if changed > 0 then
      raise notice '%.%: % satır', r.table_name, r.column_name, changed;
      total := total + changed;
    end if;
  end loop;
  raise notice 'Toplam % satır güncellendi.', total;
end $$;
