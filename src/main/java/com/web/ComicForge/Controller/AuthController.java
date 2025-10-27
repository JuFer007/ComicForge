package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.User;
import com.web.ComicForge.Service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/auth")
@AllArgsConstructor

public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    @ResponseBody
    public User register(@RequestParam String email, @RequestParam String password, @RequestParam String userName) {
        return userService.registerUser(email, password, userName);
    }

    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<User> login(@RequestParam String email, @RequestParam String password, HttpSession session) {
        try {
            User user = userService.loginUser(email, password);
            session.setAttribute("userId", user.getId());
            session.setAttribute("userRole", user.getRole());
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/logout")
    @ResponseBody
    public ResponseEntity<String> logout(HttpServletRequest request) {
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        try {
            request.logout();
        } catch (ServletException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cerrar sesión");
        }

        return ResponseEntity.ok("Sesión cerrada correctamente");
    }
}
