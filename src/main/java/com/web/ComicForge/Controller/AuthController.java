package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Service.UsuarioService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/auth")
@AllArgsConstructor

public class AuthController {
    private final UsuarioService userService;

    @PostMapping("/google-login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleGoogleLogin(
            @RequestBody Map<String, String> payload,
            HttpSession session,
            HttpServletRequest request) {

        try {
            String email = payload.get("email");
            String name = payload.get("name");
            String picture = payload.get("picture");

            Usuario usuario = userService.handleGoogleLogin(email, name, picture);

            // Configurar Spring Security Authentication
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    usuario.getEmail(),
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority(usuario.getRole()))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext());

            // Atributos de sesión adicionales
            session.setAttribute("isLoggedIn", true);
            session.setAttribute("userId", usuario.getId());
            session.setAttribute("role", usuario.getRole());
            session.setAttribute("profilePic", usuario.getProfilePicture());
            session.setAttribute("userName", usuario.getUserName());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", usuario.getId());
            response.put("role", usuario.getRole());
            response.put("profilePic", usuario.getProfilePicture());
            response.put("userName", usuario.getUserName());
            response.put("message", "Login exitoso");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error en el login: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> login(
            @RequestParam String email,
            @RequestParam String password,
            HttpSession session,
            HttpServletRequest request) {

        try {
            Usuario usuario = userService.loginUser(email, password);

            Authentication auth = new UsernamePasswordAuthenticationToken(usuario.getEmail(), null,
            Collections.singletonList(new SimpleGrantedAuthority(usuario.getRole()))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            session.setAttribute("isLoggedIn", true);
            session.setAttribute("userId", usuario.getId());
            session.setAttribute("role", usuario.getRole());
            session.setAttribute("profilePic", usuario.getProfilePicture());
            session.setAttribute("userName", usuario.getUserName());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", usuario.getId());
            response.put("role", usuario.getRole());
            response.put("profilePic", usuario.getProfilePicture());
            response.put("userName", usuario.getUserName());

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        SecurityContextHolder.clearContext();
        session.invalidate();

        Map<String, String> response = new HashMap<>();
        response.put("message", "Sesión cerrada exitosamente");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/register")
    public String showRegisterPage() {
        return "register";
    }

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> register(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String userName,
            HttpSession session,
            HttpServletRequest request) {

        try {
            Usuario usuario = userService.registerUser(email, password, userName);

            Authentication auth = new UsernamePasswordAuthenticationToken(usuario.getEmail(), null,
            Collections.singletonList(new SimpleGrantedAuthority(usuario.getRole()))
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            session.setAttribute("isLoggedIn", true);
            session.setAttribute("userId", usuario.getId());
            session.setAttribute("role", usuario.getRole());
            session.setAttribute("profilePic", usuario.getProfilePicture());
            session.setAttribute("userName", usuario.getUserName());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", usuario.getId());
            response.put("role", usuario.getRole());
            response.put("profilePic", usuario.getProfilePicture());
            response.put("userName", usuario.getUserName());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
