# Mock Mode - Quick Fix Guide

## ✅ Sudah Diperbaiki

File yang di-update:
- `src/lib/supabase.ts` - Configuration detection diperbaiki
- `src/hooks/use-chat-store.ts` - Mock mode handling improved

## 🔍 Cara Test

1. **Refresh browser** (hard refresh: Ctrl+Shift+R)
2. Buka Console (F12)
3. Cari pesan: `🔔 Rangkul running in MOCK DATA mode`

## 💬 Test Fitur Chat

1. Buka `/dashboard/community`
2. Ketik pesan: "Halo!"
3. Tekan Enter
4. **Message seharusnya muncul langsung!**

## ❌ Jika Masih Error

**Error "404"**:
- Hapus folder `.next`
- Restart dev server: `npm run dev`

**Error tetap muncul**:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Cek console untuk pesan "MOCK DATA mode"

## 🎯 Features Yang Bekerja (Mock Mode)

- ✅ Send messages (instant)
- ✅ Delete messages
- ✅ Edit messages
- ✅ Emoji reactions
- ✅ Create server
- ✅ Switch servers/channels
- ✅ Member list

**Note**: Data hilang saat refresh (normal untuk mock mode)

## 🚀 Untuk Enable Real-Time

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Restart server, data akan persist!
