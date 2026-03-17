create table if not exists public.registrations (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  registration_code text unique,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  adults integer not null,
  extra_shirts integer not null default 0,
  donation_amount integer not null,
  shirt_amount integer not null default 0,
  total_amount numeric(10,2) not null,
  payment_status text not null,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  qr_payload text
);

create index if not exists registrations_email_idx on public.registrations (email);
create index if not exists registrations_created_at_idx on public.registrations (created_at desc);
