-- 1️⃣ Enable UUID generation
create extension if not exists "pgcrypto";

-- 2️⃣ (Re)create your enums
drop type if exists course_role cascade;
create type course_role as enum ('teacher','student');

drop type if exists content_type cascade;
create type content_type as enum ('Text','Question');

drop type if exists user_type cascade;
create type user_type as enum ('LDUser','EmployeeUser');

-- 3️⃣ Extend Supabase Auth
create table if not exists profiles (
  id         uuid        primary key
    references auth.users(id) on delete cascade,
  username   text        not null unique,
  full_name  text,
  user_type  user_type   not null default 'EmployeeUser',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- auto-update updated_at
create or replace function trigger_set_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists set_profiles_updated_at on profiles;
create trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure trigger_set_timestamp();

-- 4️⃣ Courses
create table if not exists courses (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- 5️⃣ Modules (ordered)
create table if not exists modules (
  id         uuid      primary key default gen_random_uuid(),
  course_id  uuid      not null references courses(id) on delete cascade,
  title      text,
  position   int       not null,
  unique (course_id, position)
);

-- 6️⃣ Content blocks (ordered & completable)
create table if not exists content (
  id            uuid          primary key default gen_random_uuid(),
  module_id     uuid          not null references modules(id) on delete cascade,
  content_type  content_type  not null,
  content_text  text,
  is_complete   boolean       not null default false,
  position      int           not null,
  unique (module_id, position)
);

-- 7️⃣ Who’s in which course?
create table if not exists course_users (
  course_id  uuid         not null references courses(id) on delete cascade,
  user_id    uuid         not null references profiles(id) on delete cascade,
  role       course_role  not null,
  primary key (course_id, user_id)
);