

## 🛠️ Tecnologías utilizadas

### Backend
- Python 3.12
- Django
- Django REST Framework
- Django Filter
- python-dotenv

### Frontend
- Vue 3
- Quasar Framework
- Axios

---

## 📂 Estructura del proyecto

```bash
extensiones/
│
├── backend/
│
├── frontend/
│
└── README.md
```

---

# ⚙️ Instalación y configuración

## 1️⃣ Clonar repositorio

```bash
git clone https://github.com/DiegoAM13/extensiones.git
cd extensiones
```

---

# 🐍 Backend (Django)

## 2️⃣ Crear entorno virtual

### Windows (PowerShell)

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
```


---

## 3️⃣ Instalar dependencias del backend

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configurar variables de entorno (.env)

📌 Crear archivo:

```bash
backend/.env
```

Crea un archivo llamado .env dentro de Backend/ con esta estructura:

```env
DEBUG=True
SECRET_KEY=tu_clave_secreta

DB_NAME=extensiones_db
DB_USER=postgres
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
```
También puedes copiar .env.example




## 5️⃣ Ejecutar migraciones

```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 6️⃣ Crear superusuario (opcional)

```bash
python manage.py createsuperuser
```

---

## 7️⃣ Ejecutar backend

```bash
python manage.py runserver
```

📌 El backend quedará disponible en:

```bash
http://127.0.0.1:8000
```

---

# 🌐 Frontend (Quasar)

## 8️⃣ Instalar dependencias del frontend

```bash
cd ../frontend/quasar-project
npm install
```

## ⚙️ Variables de entorno (Frontend)

El proyecto frontend utiliza un archivo `.env` para manejar configuraciones específicas del entorno (API, flags, etc).

### 📁 Ubicación del archivo

El archivo debe crearse en la raíz del proyecto frontend:
---

## 9️⃣ Ejecutar frontend

```bash
quasar dev
```

📌 El frontend quedará disponible en:

```bash
http://localhost:9000
```

*(puede variar según configuración de Quasar)*





