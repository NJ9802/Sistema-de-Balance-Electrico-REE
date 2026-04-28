# ⚡ Sistema de Balance Eléctrico - Red Eléctrica de España (REE)

Este proyecto es una solución Fullstack diseñada para obtener, almacenar y visualizar datos en tiempo real del Balance Eléctrico Nacional proporcionados por la API pública de Red Eléctrica de España (REE).

## 🚀 Características Principales

- **Ingesta de Datos Automatizada**: Sincronización diaria con la API de REE mediante tareas programadas (Cron Jobs).
- **API REST Robusta**: Endpoints para consultar datos históricos y forzar ingestas manuales.
- **Dashboard Interactivo**: Visualización de datos mediante gráficos dinámicos y filtros de fecha.
- **Contenerización Completa**: Despliegue sencillo mediante Docker y Docker Compose.
- **Manejo de Errores y Resiliencia**: Reintentos automáticos en fallos de red y fallback robusto.

---

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (TypeScript)
- **Base de Datos**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Validación**: [class-validator](https://github.com/typestack/class-validator)
- **Testing**: [Jest](https://jestjs.io/)

### Frontend
- **Librería**: [React](https://react.dev/) (TypeScript)
- **Herramienta de Construcción**: [Vite](https://vitejs.dev/)
- **Estado Global & API**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **UI & Estilos**: [Material UI (MUI)](https://mui.com/)
- **Gráficos**: [Recharts](https://recharts.org/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 📊 Pipeline de Datos y Modelo

### Pipeline de Ingesta
1. **Trigger**: Un Cron Job se ejecuta diariamente a las 00:00. También existe un endpoint de `POST` para ingesta manual.
2. **Fetch**: El backend consulta el endpoint `https://apidatos.ree.es/es/datos/balance/balance-electrico`.
3. **Procesamiento**: Se transforman los datos recibidos (JSON) para adaptarlos al modelo relacional.
4. **Almacenamiento**: Se guardan las categorías y los registros de energía evitando duplicados mediante índices únicos.

### Modelo de Datos (Entidades SQL)
- **EnergyCategory**: Almacena los tipos de energía (id, título, grupo, color).
- **EnergyRecord**: Almacena el valor, porcentaje y fecha de un registro específico, vinculado a una categoría.

---

## ⚙️ Configuración y Despliegue

### Requisitos Previos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/)

### Ejecución con Docker (Recomendado)

#### Se incluye el archivo .env en el repositorio ya que como se trata de una prueba técnica, las pruebas y despliegues se realicen con mayor facilidad. Se conocen los riesgos que implica compartir variables de entorno en producción o cualquier otro entorno externo.

1. Clonar el repositorio.

2. Levantar los servicios:
   ```bash
   docker-compose up --build
   ```
3. Acceder a las aplicaciones:
   - **Frontend**: [http://localhost](http://localhost)
   - **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Endpoints Principales

### Consultar Balance
`GET /energy/balance?startDate=2024-01-01&endDate=2024-01-31`
Retorna los datos del balance eléctrico para el rango especificado.

### Ingesta Manual
`POST /energy/ingest-data`
Body: `{ "startDate": "2024-01-01", "endDate": "2024-01-05" }`
Fuerza la descarga de datos desde REE para el periodo indicado.

---

## 🧪 Testing

### Backend
Para ejecutar los tests unitarios y de integración:
```bash
cd backend
npm install
npm run test
```

### Frontend
Para ejecutar los tests de componentes y lógica:
```bash
cd frontend
npm install
npm run test
```

---

## 📸 Guía de Uso del Frontend
1.Usar la sección de "Ingesta de Datos" para traer los registros deseados.
2. La aplicación mostrará el balance del periodo seleccionado.
3. Utiliza el selector de fechas para filtrar la información.
4. El gráfico principal muestra la evolución temporal del balance.
5. Puedes usar la sección de "Ingesta de Datos" para traer nuevos registros desde la API oficial si faltan días.

---

## Capturas
![Home](/Screenshots/Home.png)
![Data Ingest](/Screenshots/Screenshot%202026-04-28%20183239.png)
![Gif](/Screenshots/Recording%202026-04-28%20183341.gif)

---

Desarrollado como parte de una prueba técnica para Fullstack Developer.
