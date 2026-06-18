-- 010_auth_user_sync.sql — Mirror new Supabase Auth users into public.users.
-- Workflow: add a user's email in Supabase → Authentication; they automatically
-- appear in Dashboard → Users & Roles, where you set their role. (Without this,
-- auth users never get a public.users row and can't be assigned a role.)

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
begin
  display_name := coalesce(
    nullif(new.raw_user_meta_data->>'name', ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    split_part(new.email, '@', 1)
  );

  insert into public.users (id, name, email, role, status)
  values (new.id, display_name, new.email, 'Content Editor', 'active')
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists tr_auth_user_created on auth.users;
create trigger tr_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_auth_user();

-- Backfill any existing auth users that don't yet have a profile row.
insert into public.users (id, name, email, role, status)
select u.id,
       coalesce(nullif(u.raw_user_meta_data->>'name', ''), split_part(u.email, '@', 1)),
       u.email, 'Content Editor', 'active'
from auth.users u
left join public.users p on p.id = u.id
where p.id is null and u.email is not null
on conflict (id) do nothing;
