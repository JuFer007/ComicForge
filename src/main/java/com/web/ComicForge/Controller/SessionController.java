package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Util.JwtUtil;
import com.web.ComicForge.Service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/session")
@AllArgsConstructor
public class SessionController {
    private final JwtUtil jwtUtil;
    private final UsuarioService usuarioService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSessionStatus(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                String email = jwtUtil.extractUsername(token);

                if (jwtUtil.validateToken(token, email)) {
                    Long userId = jwtUtil.extractUserId(token);
                    String role = jwtUtil.extractRole(token);

                    Usuario usuario = usuarioService.getUserByEmail(email).orElse(null);

                    if (usuario != null) {
                        response.put("isLoggedIn", true);
                        response.put("userId", userId);
                        response.put("role", role);
                        response.put("profilePic", usuario.getProfilePicture());
                        response.put("userName", usuario.getUserName());
                        return ResponseEntity.ok(response);
                    }
                }
            } catch (Exception e) {
                response.put("isLoggedIn", false);
                return ResponseEntity.status(401).body(response);
            }
        }
        response.put("isLoggedIn", false);
        return ResponseEntity.ok(response);
    }
}
