# ⚙️ Backend – Gestión de Prácticas Profesionales

API REST desarrollada en **Node.js + Express + MongoDB** para administrar el proceso de **prácticas profesionales** en una institución académica.  
Es el motor que alimenta al frontend (React) con datos de **alumnos** y **prácticas**, gestionando el flujo completo de etapas.

---

## 🎯 Funcionalidad

El backend permite:

- **Gestión de alumnos**
  - Registrar alumnos en práctica con datos personales y académicos.
  - Consultar, actualizar y eliminar alumnos.
  - Búsqueda por texto (nombre, NRC, centro de práctica).
  - Validación de RUT chileno.
- **Gestión de prácticas**
  - Crear práctica asociada a un alumno.
  - Avanzar la práctica en las **8 etapas definidas**:
    1. Recopilación de información / Preparación de carpeta  
    2. Entrega de carpeta  
    3. Encuesta CP  
    4. Envío de portafolio tipo e instrucciones  
    5. Supervisión de prácticas  
    6. Envío de borrador de portafolio  
    7. Subir portafolio a aula  
    8. Nota final y cierre de práctica  
  - Guardar historial de cada etapa (fecha, notas, estado).
  - Registrar nota final y cerrar práctica.

---
