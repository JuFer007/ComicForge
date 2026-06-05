<div align="center">
  <img src="src/main/resources/static/recursos/ComicForge%20logo.png" alt="Comic Forge" width="120"/>
  <br><br>
  <p><strong>Plataforma web de comercio electrónico para venta y lectura de cómics digitales con autenticación, carrito de compras, lector integrado y panel de administración</strong></p>

  ![Java](https://img.shields.io/badge/Java-ED8B00?logo=java&logoColor=white)
  ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?logo=springboot&logoColor=white)
  ![Thymeleaf](https://img.shields.io/badge/Thymeleaf-005F0F?logo=thymeleaf&logoColor=white)
  ![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
  ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
  ![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)
  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
</div>

---

## Capturas de Pantalla

<div align="center">
  <h3>Pagina Principal</h3>
  <img src="capturas/home1.png" alt="Home 1" width="45%"/>
  <img src="capturas/home2.png" alt="Home 2" width="45%"/>
  <img src="capturas/home3.png" alt="Home 3" width="45%"/>
  <img src="capturas/home4.png" alt="Home 4" width="45%"/>
  <img src="capturas/home5.png" alt="Home 5" width="45%"/>
  <img src="capturas/modal.png" alt="Modal" width="45%"/>
</div>

<div align="center">
  <h3>Autenticacion</h3>
  <img src="capturas/login.png" alt="Login" width="45%"/>
  <img src="capturas/registro.png" alt="Registro" width="45%"/>
</div>

<div align="center">
  <h3>Secciones</h3>
  <img src="capturas/descuentos.png" alt="Descuentos" width="45%"/>
  <img src="capturas/descuentos2.png" alt="Descuentos 2" width="45%"/>
  <img src="capturas/personajes.png" alt="Personajes" width="45%"/>
  <img src="capturas/personajes1.png" alt="Personajes 1" width="45%"/>
</div>

<div align="center">
  <h3>Perfil de Usuario</h3>
  <img src="capturas/perfil.png" alt="Perfil" width="45%"/>
  <img src="capturas/perfil1.png" alt="Perfil 1" width="45%"/>
  <img src="capturas/editarPerfil.png" alt="Editar Perfil" width="45%"/>
  <img src="capturas/elegirAvatar.png" alt="Elegir Avatar" width="45%"/>
</div>

<div align="center">
  <h3>Carrito y Lector</h3>
  <img src="capturas/carritoCompras.png" alt="Carrito" width="45%"/>
  <img src="capturas/leerComic.png" alt="Lector de Comics" width="45%"/>
</div>

---

## Caracteristicas

### Autenticacion y Seguridad
- Registro e inicio de sesion con email
- Autenticacion OAuth2 con Google
- Roles de usuario (Cliente / Administrador)
- Tokens JWT con expiracion
- Proteccion CSRF y BCrypt

### Perfiles de Usuario
- Avatar personalizable (12 superheroes)
- Biografia y portada personalizada
- Biblioteca de comics comprados
- Sistema de favoritos
- Historial de compras

### Catalogo de Comics
- Navegacion por editoriales (Marvel, DC)
- Seccion de mas vendidos y descuentos
- Busqueda por titulo y editorial
- Modal con detalles completos
- Tarjetas con portada, precio y descuento

### Carrito de Compras
- Agregar y gestionar multiples comics
- Validacion de productos ya adquiridos
- Prevencion de duplicados
- Calculo automatico del total
- Checkout simplificado

### Lector de Comics
- Visualizacion de PDF pagina por pagina
- Soporte para Google Drive
- Modo doble pagina
- Atajos de teclado
- Pantalla completa (tecla F)

### Panel de Administracion
- Dashboard con estadisticas en tiempo real
- Graficos de ventas (Chart.js)
- CRUD completo de comics
- Gestion de usuarios
- Exportacion de reportes a Excel

---

## Tecnologias

| Backend | Frontend | Base de Datos | Herramientas |
|---------|----------|---------------|--------------|
| Java 17 | HTML5 | MySQL | Maven |
| Spring Boot | CSS3 | JPA/Hibernate | Git |
| Spring Security | JavaScript | | Apache POI |
| Spring OAuth2 | Bootstrap 5 | | Chart.js |
| Thymeleaf | AJAX | | Dotenv |

---

## Arquitectura

- **MVC** (Model-View-Controller)
- **DTO** para transferencia de datos
- **Repository** para acceso a datos
- **Service** para logica de negocio
- **SPA-like** con JavaScript vanilla y AJAX

---

## Como ejecutar

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/comic-forge.git

# 2. Configurar base de datos MySQL
# Ejecutar ScriptCreacion.sql en tu gestor MySQL

# 3. Configurar variables de entorno (.env)
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
JWT_SECRET=tu_secreto_jwt

# 4. Ejecutar la aplicacion
./mvnw spring-boot:run
```

---

## Licencia
Proyecto academico desarrollado con fines educativos.

## Creditos
Desarrollado por el equipo de Comic Forge.
(c) 2025 Comic Forge