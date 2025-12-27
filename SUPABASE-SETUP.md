# 🚀 Supabase Setup - Quick Guide

## ✅ Step 1: Copy SQL Schema

SQL schema sudah siap di: `src/lib/supabase-schema.sql`

## ✅ Step 2: Run di Supabase

1. **Buka**: https://supabase.com/dashboard
2. **Login** dan pilih project Anda
3. **Klik "SQL Editor"** (sidebar kiri)
4. **New Query** → Paste semua isi `supabase-schema.sql`
5. **Run** (Ctrl+Enter)

Tunggu sampai semua statement selesai!

## ✅ Step 3: Verify Tables

Di sidebar, klik **"Table Editor"**, seharusnya ada:
- ✅ users
- ✅ servers  
- ✅ channels
- ✅ messages
- ✅ server_members
- ✅ message_reactions
- ✅ user_presence
- ✅ dm_channels
- ✅ dm_participants
- ✅ server_invites

## ✅ Step 4: Test

1. Refresh browser
2. Buka `/dashboard/community`
3. Kirim message
4. **Cek di Supabase Table Editor** → messages table
5. Message Anda seharusnya tersimpan! 🎉

## 🔧 Jika Ada Error

**"auth.uid() is null"**:
- Normal! Authentication belum disetup
- Untuk sekarang, disable RLS sementara:
```sql
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE servers DISABLE ROW LEVEL SECURITY;
ALTER TABLE channels DISABLE ROW LEVEL SECURITY;
```

**"Table already exists"**:
- SQL sudah pernah dijalankan
- Skip ke Step 3 untuk verify

## 🎯 Next: Enable Authentication

Lihat `implementation_plan.md` untuk setup Supabase Auth!
