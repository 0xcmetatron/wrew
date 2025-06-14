# 🚀 Despliegue en Vercel - BonkBurn

## ✅ Configuración completa para burn de tokens y pagos de recompensas

### 📋 **Pasos para desplegar:**

#### 1. **Conectar repositorio a Vercel**

- Ve a [vercel.com](https://vercel.com)
- Conecta tu repositorio de GitHub
- Vercel detectará automáticamente la configuración

#### 2. **Configurar variables de entorno (Opcional para recompensas reales)**

En tu dashboard de Vercel, ve a Settings > Environment Variables:

```bash
# Para recompensas demo (no requiere configuración)
# La app funcionará automáticamente con recompensas simuladas

# Para recompensas reales (opcional):
REWARD_WALLET_PRIVATE_KEY=[123,45,67,89,...]  # Array de números de la clave privada
```

#### 3. **Deploy**

- Haz push a tu repositorio
- Vercel desplegará automáticamente
- ¡Listo! 🎉

### ���� **Cómo funciona:**

#### **APIs Serverless incluidas:**

- ✅ **`/api/burn`** - Crea transacciones de burn reales
- ✅ **`/api/reward`** - Procesa pagos de recompensas
- ✅ **CORS configurado** - Funciona desde cualquier dominio
- ✅ **Validaciones robustas** - Manejo de errores completo

#### **Modos de funcionamiento:**

1. **Desarrollo local** (`localhost`)

   - Usa mock APIs para testing
   - No requiere wallet de recompensas

2. **Producción/Preview en Vercel**
   - Usa APIs serverless reales
   - Sin `REWARD_WALLET_PRIVATE_KEY` → Recompensas demo
   - Con `REWARD_WALLET_PRIVATE_KEY` → Recompensas reales en SOL

### 💰 **Sistema de recompensas:**

```javascript
// Configuración actual:
BONK: 0.005 SOL
USDC: 0.003 SOL
DEFAULT: 0.004 SOL
```

### 🔐 **Para recompensas reales:**

1. **Crear wallet de recompensas:**

```bash
# Instalar Solana CLI
npm install -g @solana/cli

# Generar nuevo keypair
solana-keygen new --outfile reward-wallet.json

# Ver la clave pública
solana-keygen pubkey reward-wallet.json

# Convertir a formato de array para Vercel
node -e "console.log(JSON.stringify(Array.from(require('fs').readFileSync('reward-wallet.json'))))"
```

2. **Fondear el wallet:**

- Envía SOL al wallet para pagos de recompensas
- Ejemplo: 10 SOL = ~2000 recompensas de 0.005 SOL

3. **Configurar en Vercel:**

- Pega el array de números en `REWARD_WALLET_PRIVATE_KEY`

### 🎯 **URLs de ejemplo:**

- **Tu app:** `https://tu-app.vercel.app`
- **API burn:** `https://tu-app.vercel.app/api/burn`
- **API reward:** `https://tu-app.vercel.app/api/reward`

### 🔍 **Testing:**

```bash
# Test burn API
curl -X POST https://tu-app.vercel.app/api/burn \
  -H "Content-Type: application/json" \
  -d '{"publicKey":"...","tokenMint":"...","amount":1000,"decimals":6}'

# Test reward API
curl -X POST https://tu-app.vercel.app/api/reward \
  -H "Content-Type: application/json" \
  -d '{"publicKey":"...","burnSignature":"...","tokenSymbol":"BONK","burnAmount":1000}'
```

### ⚡ **Optimizaciones incluidas:**

- ✅ **CDN global** de Vercel
- ✅ **Caching automático** de assets
- ✅ **Compresión gzip/brotli**
- ✅ **HTTPS automático**
- ✅ **Edge functions** para APIs
- ✅ **Rollbacks automáticos** en caso de errores

### 🎉 **¡Todo listo!**

Tu aplicación funcionará completamente:

- ✅ **Carga de tokens** real desde Solana
- ✅ **Burn de tokens** con transacciones reales
- ✅ **Pagos de recompensas** automáticos
- ✅ **Sin errores 404**
- ✅ **Experiencia completa** para usuarios

**¡Solo haz push y despliega!** 🚀
