-- ============================================================================
--  Taxzilla — Supabase schema
--  Run this once in your Supabase project's SQL Editor (or via the CLI).
--  Safe to re-run: uses IF NOT EXISTS / idempotent statements.
--
--  Security model: the app talks to the DB ONLY through the service-role key
--  on the server. RLS is enabled with NO public policies, so the anon/public
--  API cannot read or write these tables. The service role bypasses RLS.
-- ============================================================================

-- Job applications (careers form)
create sequence if not exists public.candidates_ref_no_seq;

create table if not exists public.candidates (
  id          uuid primary key default gen_random_uuid(),
  ref_no      bigint not null default nextval('public.candidates_ref_no_seq'),
  name        text not null,
  phone       text not null,
  email       text not null,
  message     text not null default '',
  resume_file text,
  photo_file  text,
  status      text not null default 'new',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists candidates_created_at_idx on public.candidates (created_at desc);

-- Existing projects may already have the table from an older schema.
alter table public.candidates add column if not exists ref_no bigint;
with next_refs as (
  select
    id,
    (select coalesce(max(ref_no), 0) from public.candidates) +
      row_number() over (order by created_at asc, id asc) as new_ref_no
  from public.candidates
  where ref_no is null or ref_no < 1
)
update public.candidates c
set ref_no = next_refs.new_ref_no
from next_refs
where c.id = next_refs.id;
alter table public.candidates alter column ref_no set default nextval('public.candidates_ref_no_seq');
alter table public.candidates alter column ref_no set not null;
select setval(
  'public.candidates_ref_no_seq',
  greatest(coalesce((select max(ref_no) from public.candidates), 0), 1),
  coalesce((select max(ref_no) from public.candidates), 0) > 0
);
create unique index if not exists candidates_ref_no_idx on public.candidates (ref_no);

alter table public.candidates add column if not exists updated_at timestamptz;
update public.candidates set updated_at = created_at where updated_at is null;
alter table public.candidates alter column updated_at set default now();
alter table public.candidates alter column updated_at set not null;
create index if not exists candidates_updated_at_idx on public.candidates (updated_at desc);

create or replace function public.set_candidate_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists candidates_set_updated_at on public.candidates;
create trigger candidates_set_updated_at
before update on public.candidates
for each row
execute function public.set_candidate_updated_at();

-- Contact form enquiries
create table if not exists public.contact_enquiries (
  id         uuid primary key default gen_random_uuid(),
  fullname   text not null,
  contact    text not null,
  email      text not null,
  about      text not null default '',
  message    text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists contact_enquiries_created_at_idx on public.contact_enquiries (created_at desc);

-- Newsletter subscribers (email unique → idempotent subscribe)
create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- Lock everything down: enable RLS, add NO policies.
alter table public.candidates             enable row level security;
alter table public.contact_enquiries      enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Private storage bucket for résumés / photos (not publicly readable).
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', false)
on conflict (id) do nothing;
