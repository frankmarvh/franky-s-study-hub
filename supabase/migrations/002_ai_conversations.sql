-- ============================================================
-- FRANKY'S STUDY HUB
-- AI CONVERSATIONS
-- ============================================================

create table if not exists public.chat_conversations (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null default 'New conversation',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references public.chat_conversations(id)
    on delete cascade,

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  role text not null
    check (
      role in ('user', 'assistant')
    ),

  content text not null,

  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists
idx_chat_conversations_user
on public.chat_conversations(user_id);

create index if not exists
idx_chat_conversations_updated
on public.chat_conversations(updated_at desc);

create index if not exists
idx_chat_messages_conversation
on public.chat_messages(conversation_id);

create index if not exists
idx_chat_messages_created
on public.chat_messages(created_at);

-- ============================================================
-- UPDATED AT TRIGGER
-- ============================================================

drop trigger if exists
update_chat_conversations_updated_at
on public.chat_conversations;

create trigger
update_chat_conversations_updated_at
before update
on public.chat_conversations
for each row
execute function
public.update_updated_at_column();

-- ============================================================
-- RLS
-- ============================================================

alter table public.chat_conversations
enable row level security;

alter table public.chat_messages
enable row level security;

-- ============================================================
-- REMOVE OLD POLICIES
-- ============================================================

drop policy if exists
"Users can view own conversations"
on public.chat_conversations;

drop policy if exists
"Users can create own conversations"
on public.chat_conversations;

drop policy if exists
"Users can update own conversations"
on public.chat_conversations;

drop policy if exists
"Users can delete own conversations"
on public.chat_conversations;

drop policy if exists
"Users can view own messages"
on public.chat_messages;

drop policy if exists
"Users can create own messages"
on public.chat_messages;

drop policy if exists
"Users can delete own messages"
on public.chat_messages;

-- ============================================================
-- CONVERSATION POLICIES
-- ============================================================

create policy
"Users can view own conversations"
on public.chat_conversations
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy
"Users can create own conversations"
on public.chat_conversations
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy
"Users can update own conversations"
on public.chat_conversations
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

create policy
"Users can delete own conversations"
on public.chat_conversations
for delete
to authenticated
using (
  auth.uid() = user_id
);

-- ============================================================
-- MESSAGE POLICIES
-- ============================================================

create policy
"Users can view own messages"
on public.chat_messages
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy
"Users can create own messages"
on public.chat_messages
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.chat_conversations
    where id = conversation_id
      and user_id = auth.uid()
  )
);

create policy
"Users can delete own messages"
on public.chat_messages
for delete
to authenticated
using (
  auth.uid() = user_id
);
