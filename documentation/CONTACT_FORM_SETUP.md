# Configuración del Formulario de Contacto

Este documento explica cómo configurar el formulario de contacto para que envíe correos a través de Gmail usando Vercel.

## Requisitos

- Cuenta de Gmail
- Proyecto desplegado en Vercel
- Node.js instalado (para desarrollo local)

## Configuración de Gmail

### 1. Habilitar la Verificación en Dos Pasos

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Navega a **Seguridad**
3. Habilita la **Verificación en dos pasos** si no está activada

### 2. Generar una Contraseña de Aplicación

1. Ve a: https://myaccount.google.com/apppasswords
2. En "Seleccionar app", elige **Correo**
3. En "Seleccionar dispositivo", elige **Otro (nombre personalizado)**
4. Escribe "Chikielau Website" o el nombre que prefieras
5. Haz clic en **Generar**
6. Copia la contraseña de 16 caracteres que aparece (sin espacios)

## Configuración en Vercel

### Variables de Entorno

Agrega las siguientes variables de entorno en tu proyecto de Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=tu_contraseña_de_16_caracteres
```

**Importante:** 
- `GMAIL_USER` debe ser tu dirección de Gmail completa
- `GMAIL_APP_PASSWORD` es la contraseña de aplicación generada (16 caracteres sin espacios)
- Los correos del formulario se enviarán a la dirección especificada en `GMAIL_USER`

### 4. Redesplegar el Proyecto

Después de agregar las variables de entorno, redespliega tu proyecto:

```bash
vercel --prod
```

O simplemente haz un nuevo commit y push si tienes integración con Git.

## Desarrollo Local

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Crear Archivo .env

Crea un archivo `.env` en la raíz del proyecto (no lo subas a Git):

```env
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=tu_contraseña_de_16_caracteres
```

### 3. Ejecutar Vercel Dev

```bash
vercel dev
```

Esto iniciará un servidor local que simula el entorno de Vercel.

## Cómo Funciona

1. El usuario completa el formulario en `/contact.html`
2. JavaScript valida los campos del formulario
3. Los datos se envían a `/api/contact` mediante POST
4. La función serverless en Vercel:
   - Valida los datos recibidos
   - Usa Nodemailer con Gmail SMTP
   - Envía el correo a tu dirección de Gmail
   - El campo "Reply-To" se configura con el email del usuario
5. Se muestra un mensaje de éxito o error al usuario

## Estructura de Archivos

```
├── api/
│   └── contact.js          # Función serverless para enviar correos
├── js/
│   ├── script.js           # Lógica del formulario
│   └── translations.js     # Traducciones de mensajes
├── contact.html            # Página del formulario
├── package.json            # Dependencias (nodemailer)
├── vercel.json            # Configuración de Vercel
└── .env.example           # Ejemplo de variables de entorno
```

## Solución de Problemas

### Error: "Invalid login"

- Verifica que `GMAIL_USER` sea correcto
- Asegúrate de usar la contraseña de aplicación, no tu contraseña normal
- Confirma que la verificación en dos pasos esté habilitada

### Error: "Network error"

- Verifica que las variables de entorno estén configuradas en Vercel
- Redespliega el proyecto después de agregar las variables

### Los correos no llegan

- Revisa la carpeta de spam
- Verifica que `GMAIL_USER` sea la dirección correcta
- Comprueba los logs en Vercel Dashboard → Functions

### Error en desarrollo local

- Asegúrate de tener el archivo `.env` con las variables correctas
- Usa `vercel dev` en lugar de otros servidores locales
- Instala las dependencias con `npm install`

## Seguridad

- ✅ Las contraseñas de aplicación son más seguras que usar tu contraseña principal
- ✅ Las variables de entorno no se exponen al cliente
- ✅ La función serverless valida todos los datos de entrada
- ✅ El archivo `.env` está en `.gitignore` y no se sube a Git

## Personalización

### Cambiar el Destinatario

Para enviar correos a una dirección diferente, modifica `GMAIL_USER` en las variables de entorno de Vercel.

### Personalizar el Email

Edita el HTML del correo en `api/contact.js`, líneas 35-48.

### Agregar Campos al Formulario

1. Agrega los campos en `contact.html`
2. Actualiza la validación en `js/script.js`
3. Modifica `api/contact.js` para incluir los nuevos campos

## Soporte

Si tienes problemas con la configuración:

1. Revisa los logs en Vercel Dashboard
2. Verifica que todas las variables de entorno estén configuradas
3. Asegúrate de que la contraseña de aplicación sea válida
4. Comprueba que Gmail no esté bloqueando el acceso

## Referencias

- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vercel Serverless Functions](https://vercel.com/docs/concepts/functions/serverless-functions)
