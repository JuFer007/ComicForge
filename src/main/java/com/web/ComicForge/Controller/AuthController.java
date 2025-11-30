package com.web.ComicForge.Controller;
import com.web.ComicForge.DTO.LoginRequest;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Util.JwtUtil;
import com.web.ComicForge.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/auth")
@AllArgsConstructor

public class AuthController {
    private final UsuarioService userService;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> register(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String userName,
            HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        try {
            Usuario usuario = userService.registerUser(email, password, userName);

            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRole(), usuario.getId());

            session.setAttribute("userId", usuario.getId());
            session.setAttribute("role", usuario.getRole());

            response.put("success", true);
            response.put("token", token);
            response.put("userId", usuario.getId());
            response.put("role", usuario.getRole());
            response.put("profilePic", usuario.getProfilePicture());
            response.put("userName", usuario.getUserName());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request, HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.getEmail();
            String password = request.getPassword();

            Usuario usuario = userService.getUserByEmail(email).orElse(null);

            if (usuario == null || !passwordEncoder.matches(password, usuario.getPassword())) {
                response.put("success", false);
                response.put("message", "Correo o contraseña incorrectos");
                return ResponseEntity.badRequest().body(response);
            }

            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRole(), usuario.getId());

            session.setAttribute("userId", usuario.getId());
            session.setAttribute("role", usuario.getRole());

            response.put("success", true);
            response.put("token", token);
            response.put("userId", usuario.getId());
            response.put("role", usuario.getRole());
            response.put("profilePic", usuario.getProfilePicture());
            response.put("userName", usuario.getUserName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error en el servidor: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/google-login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> handleGoogleLogin(@RequestBody Map<String, String> payload, HttpSession session) {

        Map<String, Object> response = new HashMap<>();

        try {
            String email = payload.get("email");
            String name = payload.get("name");
            String picture = payload.get("picture");

            Usuario usuario = userService.handleGoogleLogin(email, name, picture);

            String token = jwtUtil.generateToken(usuario.getEmail(), usuario.getRole(), usuario.getId());

            session.setAttribute("userId", usuario.getId());
            session.setAttribute("role", usuario.getRole());

            response.put("success", true);
            response.put("token", token);
            response.put("userId", usuario.getId());
            response.put("role", usuario.getRole());
            response.put("profilePic", usuario.getProfilePicture());
            response.put("userName", usuario.getUserName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error en el login: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        session.invalidate();

        Map<String, String> response = new HashMap<>();
        response.put("message", "Sesión cerrada exitosamente");
        return ResponseEntity.ok(response);
    }
}
