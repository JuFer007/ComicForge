# 🦸 Comic Forge - Sistema de Gestión y Venta de Cómics Digitales

📖 Descripción del Sistema
Comic Forge es una plataforma web completa de comercio electrónico especializada en la venta y lectura de cómics digitales. El sistema permite a los usuarios navegar, comprar y leer cómics de diferentes editoriales (Marvel, DC Comics, entre otras) directamente desde su navegador web, ofreciendo una experiencia de usuario moderna y fluida.
La aplicación está desarrollada con Spring Boot y Thymeleaf, proporcionando una arquitectura robusta que integra autenticación segura, gestión de usuarios, procesamiento de pagos, y un panel de administración completo para la gestión del catálogo y análisis de ventas.

✨ Características Principales
🔐 Sistema de Autenticación y Autorización

Registro de usuarios con validación de datos
Inicio de sesión tradicional con email y contraseña
Autenticación OAuth2 mediante Google (inicio de sesión social)
Sistema de roles (Cliente y Administrador)
Tokens JWT para manejo seguro de sesiones
Encriptación de contraseñas con BCrypt

👤 Gestión de Perfiles de Usuario

Perfil personalizable con:

Selección de avatar predefinido (12 opciones de superhéroes)
Biografía personalizada
Imágenes de portada (4 opciones disponibles)


Biblioteca personal de cómics comprados
Sistema de favoritos para marcar cómics preferidos
Historial de compras integrado en el perfil

📚 Catálogo de Cómics

Navegación por categorías:

Marvel Comics
DC Comics
Más Vendidos
Descuentos


Sistema de búsqueda y filtrado por título y editorial
Tarjetas informativas con:

Imagen de portada
Título y descripción
Precio y descuentos aplicables
Editorial


Modal de detalles para vista previa completa

🛒 Sistema de Carrito de Compras

Agregar múltiples cómics al carrito
Validación automática de productos ya adquiridos
Prevención de duplicados en el carrito
Cálculo automático del total de compra
Persistencia del carrito durante la sesión
Proceso de checkout simplificado

📖 Lector de Cómics Integrado

Visualización de PDFs con navegación página por página
Soporte para Google Drive (visualización mediante iframe)
Modo doble página para experiencia de lectura realista
Controles de navegación:

Botones anterior/siguiente
Indicador de página actual
Atajos de teclado (flechas izquierda/derecha)


Modo pantalla completa (tecla F)
Indicador de carga mientras se procesa el documento

🎨 Interfaz de Usuario

Diseño responsive adaptado a todos los dispositivos
Modo oscuro/claro con persistencia de preferencia
Animaciones suaves y transiciones
Sistema de notificaciones toast para feedback al usuario
Carrusel de cómics destacados en la página principal
Galería de personajes con tabs informativos (descripción, poderes, equipos)


🛡️ Panel de Administración
📊 Dashboard Principal

Estadísticas en tiempo real:

Total de ventas del día
Cantidad total de cómics en catálogo
Número de clientes activos


Gráficos analíticos:

Top 5 cómics más vendidos (gráfico de barras vertical)
Distribución de cómics por editorial (gráfico circular)



✏️ Gestión de Cómics

CRUD completo de cómics:

✅ Crear: Formulario con carga de imagen y PDF
📖 Leer: Visualización en tabla con búsqueda y filtros
✏️ Actualizar: Edición de título, precio, descripción y descuento
🗑️ Eliminar: Con modal de confirmación


Validaciones:

Títulos únicos
Precio mínimo de S/1.00
Formato de archivos (imágenes: JPG/PNG máx. 5MB, PDF máx. 50MB)


Vista previa de archivos antes de subir
Categorización automática por editorial

👥 Gestión de Usuarios

Lista completa de usuarios registrados
Búsqueda por nombre o email
Eliminación de cuentas de usuario
Visualización de información básica (nombre, email)

💰 Gestión de Ventas

Historial completo de transacciones con:

ID de venta
Cliente
Cómics comprados
Fecha y hora
Monto total
Estado de la compra


Filtrado por rango de fechas
Exportación a Excel con formato profesional
Detalles expandidos por venta


🔧 Funcionalidades Técnicas
Sistema de Archivos

Almacenamiento local de imágenes y PDFs en archivosComics/
Nombrado sanitizado de archivos (sin caracteres especiales)
Organización automática por tipo (imágenes y PDFs separados)
Servicio de archivos estáticos configurado

Seguridad Implementada

Protección CSRF en formularios
Validación de sesión en cada petición
Control de acceso por rol (RBAC)
Sanitización de entradas de usuario
Validación de tipos de archivo en subidas
Tokens con expiración (24 horas)

Integración con APIs Externas

OAuth2 con Google para autenticación social
Dotenv para gestión segura de credenciales
Variables de entorno para configuración sensible

Base de Datos

Entidades principales:

Usuario (con roles y relaciones)
Comic (con categorías y descuentos)
Sale (ventas con fecha y total)
DetailSale (detalles de cada venta)


Relaciones Many-to-Many:

Usuario ↔ Cómics Comprados
Usuario ↔ Cómics Favoritos


Consultas optimizadas con JPA


🎯 Casos de Uso Principales
Para un Usuario Cliente:

Se registra o inicia sesión (con email o Google)
Navega por el catálogo de cómics por categoría
Agrega cómics de interés al carrito
Revisa el carrito y procede al checkout
Accede a su perfil para ver sus cómics comprados
Lee sus cómics directamente en el navegador
Marca cómics como favoritos para acceso rápido
Personaliza su perfil (avatar, biografía, portada)

Para un Administrador:

Inicia sesión con credenciales de administrador
Accede al dashboard para ver estadísticas
Agrega nuevos cómics con imágenes y archivos PDF
Edita información de cómics existentes
Elimina cómics descatalogados
Revisa el historial de ventas
Exporta reportes de ventas a Excel
Gestiona usuarios registrados


🌟 Características Destacadas del Sistema
✅ Validaciones Inteligentes

No permite agregar cómics ya comprados al carrito
Previene duplicados en el carrito de compras
Valida unicidad de títulos al crear cómics
Verifica formatos y tamaños de archivos

🚀 Rendimiento

Paginación en listados grandes
Carga diferida de imágenes
Optimización de consultas a base de datos
Caché de recursos estáticos

📱 Responsive Design

Adaptación automática a móviles, tablets y desktop
Menú hamburguesa en dispositivos pequeños
Carruseles ajustables según tamaño de pantalla
Grids fluidos con Bootstrap

🎨 Experiencia de Usuario

Notificaciones toast informativas y no intrusivas
Transiciones suaves entre secciones
Feedback visual en todas las acciones
Modales para confirmaciones importantes
Indicadores de carga en operaciones asíncronas

🔄 Sincronización en Tiempo Real

Actualización automática del navbar al iniciar sesión
Recarga de gráficos tras agregar/editar/eliminar cómics
Actualización del carrito sin recargar página
Persistencia de preferencias (modo oscuro)


📦 Módulos del Sistema
Módulo de Autenticación (Auth)

Registro de usuarios
Login tradicional
Login con Google OAuth2
Logout con limpieza de sesión
Generación y validación de JWT

Módulo de Catálogo (Comics)

Listado de todos los cómics
Filtrado por categoría
Búsqueda por título
Detalles de cada cómic

Módulo de Carrito (Cart)

Agregar al carrito
Eliminar del carrito
Visualizar carrito
Proceso de checkout

Módulo de Ventas (Sales)

Registro de transacciones
Historial de ventas
Exportación de reportes
Estadísticas de ventas

Módulo de Usuario (User)

Perfil personalizado
Biblioteca de cómics
Favoritos
Edición de perfil

Módulo de Administración (Admin)

Dashboard con métricas
CRUD de cómics
Gestión de usuarios
Reportes y análisis

Módulo de Lectura (Reader)

Visualizador de PDFs
Integración con Google Drive
Controles de navegación
Modo pantalla completa


🎓 Tecnologías y Patrones Aplicados
Arquitectura

MVC (Model-View-Controller) para separación de responsabilidades
Patrón DTO para transferencia de datos
Patrón Repository para acceso a datos
Patrón Service para lógica de negocio

Seguridad

JWT (JSON Web Tokens) para autenticación stateless
BCrypt para hash de contraseñas
Spring Security para control de acceso
OAuth2 para autenticación federada

Frontend

SPA-like behavior con JavaScript vanilla
AJAX para comunicación asíncrona
LocalStorage para persistencia de sesión en cliente
Chart.js para visualización de datos

Backend

JPA/Hibernate para ORM
Bean Validation para validación de datos
Custom Validators para reglas de negocio específicas
Apache POI para generación de Excel


📈 Métricas y Análisis
El sistema proporciona información analítica valiosa:

Ventas totales acumuladas
Ranking de cómics más vendidos
Distribución de catálogo por editorial
Cantidad de usuarios activos
Historial temporal de transacciones


🎨 Elementos Visuales Distintivos
Página Principal

Carrusel automático de cómics más vendidos
Botones animados para cambiar entre categorías (Marvel/DC)
Grid responsive de tarjetas de cómics
Footer con redes sociales y métodos de pago

Página de Descuentos

Tarjetas expandidas con información detallada
Badges de porcentaje de descuento
Precio tachado vs precio actual
Tags de personajes principales

Página de Personajes

Galería en grid de superhéroes
Tabs con información (descripción, poderes, equipos)
Imágenes de alta calidad

Perfil de Usuario

Portada personalizable
Avatar circular flotante
Tabs para cómics comprados y favoritos
Modal de edición con selección de avatares

Panel de Administración

Sidebar lateral con navegación
Cards de estadísticas con iconos
Tablas con acciones inline
Gráficos interactivos con Chart.js
Modales para confirmaciones


🔮 Futuras Mejoras Potenciales

Sistema de reseñas y calificaciones
Wishlist de cómics deseados
Recomendaciones personalizadas con ML
Chat de soporte en tiempo real
Suscripciones mensuales
Sistema de notificaciones push
Integración con pasarelas de pago reales
API REST pública para desarrolladores
Aplicación móvil nativa


📄 Licencia
Este proyecto es un sistema académico desarrollado con fines educativos.

👥 Créditos
Desarrollado por el equipo de Comic Forge como proyecto de aplicación web con Spring Boot.
© 2025 Comic Forge - Todos los derechos reservados
