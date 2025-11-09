# Google Drive Storage Setup

## 2 Cara Setup

### Cara 1: Pakai Folder Existing (Recommended)
Langsung pakai folder yang sudah ada di Drive.

**Steps:**
1. Buka Google Drive
2. Buat/pilih folder yang mau dipakai
3. Copy Folder ID dari URL
   ```
   URL: https://drive.google.com/drive/folders/19PTMbU84pUTTdI3XSSgkNUvNXQZVwwXs
   Folder ID: 19PTMbU84pUTTdI3XSSgkNUvNXQZVwwXs
   ```
4. Set di ENV:
   ```bash
   DRIVE_ROOT_FOLDER_ID="19PTMbU84pUTTdI3XSSgkNUvNXQZVwwXs"
   ```

**Benefits:**
- ✅ Langsung pakai folder existing
- ✅ Tidak create folder baru
- ✅ Bisa organize manual di Drive
- ✅ Lebih kontrol

### Cara 2: Auto-Create by Name
System auto create folder dengan nama yang di-config.

**Steps:**
1. Set di ENV:
   ```bash
   DRIVE_ROOT_FOLDER="dibeli.my.id"
   DRIVE_STORES_FOLDER="toko"
   ```
2. System auto create jika belum ada

**Benefits:**
- ✅ Otomatis create folder
- ✅ Nama folder konsisten
- ✅ No manual setup needed

---

## Struktur Folder

Product images disimpan di Google Drive dengan struktur:

```
{DRIVE_ROOT_FOLDER}/
└── {DRIVE_STORES_FOLDER}/
    └── {store-name}/
        └── {product-slug}/
            ├── product-slug-1.jpg
            ├── product-slug-2.jpg
            └── product-slug-3.jpg
```

## Environment Variables

Tambahkan ke `.env`:

```bash
# Google Drive Storage
DRIVE_ROOT_FOLDER="dibeli.my.id"      # Root folder di Drive
DRIVE_STORES_FOLDER="toko"             # Subfolder untuk semua toko
```

### Default Values

Jika tidak diset, akan menggunakan:
- `DRIVE_ROOT_FOLDER` → `"dibeli.my.id"`
- `DRIVE_STORES_FOLDER` → `"toko"`

## Contoh per Environment

### Development
```bash
DRIVE_ROOT_FOLDER="dibeli-dev"
DRIVE_STORES_FOLDER="stores"
```

Struktur: `dibeli-dev/stores/{store-name}/{product-slug}/`

### Staging
```bash
DRIVE_ROOT_FOLDER="dibeli-staging"
DRIVE_STORES_FOLDER="toko"
```

Struktur: `dibeli-staging/toko/{store-name}/{product-slug}/`

### Production
```bash
DRIVE_ROOT_FOLDER="dibeli.my.id"
DRIVE_STORES_FOLDER="toko"
```

Struktur: `dibeli.my.id/toko/{store-name}/{product-slug}/`

## Cara Kerja

1. User upload product images
2. System check ENV untuk nama folder
3. Create folder structure di Google Drive user
4. Upload images ke folder product
5. Store Drive file IDs di database
6. Display images via Drive URL

## Benefits

### Flexible Configuration
- Beda folder per environment
- Easy to organize
- No code changes needed

### Multi-Tenant Friendly
- Setiap environment punya folder sendiri
- Dev/staging tidak campur dengan production
- Easy cleanup per environment

### User Owns Data
- Images di Drive user sendiri
- User bisa manage via Drive UI
- Easy backup/export

## OAuth Scopes Required

Pastikan OAuth includes:
```
https://www.googleapis.com/auth/drive.file
```

Scope ini sudah included di setup OAuth Google.

## Folder Permissions

System automatically:
- Creates folders if not exist
- Sets public read permission
- Returns direct image URLs

## Troubleshooting

### Folder not created?
- Check OAuth token valid
- Check Drive API enabled
- Check scope includes `drive.file`

### Permission denied?
- User needs to re-login
- Refresh OAuth token
- Check Drive storage quota

### Images not showing?
- Check file IDs stored correctly
- Check public permission set
- Check Drive URL format

## Migration

Jika mau ganti folder name:
1. Update ENV variables
2. Restart app
3. New uploads go to new folder
4. Old images still work (masih ada di old folder)
5. Optional: Move files manually di Drive

## Monitoring

Check logs untuk:
```
Created root folder: dibeli.my.id
Created stores folder: toko
Created store folder: Toko ABC
Created product folder: iphone-15-pro
```

Jika ada error, check:
- Drive API quota
- OAuth token expiry
- Storage limits
