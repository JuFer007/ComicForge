package com.web.ComicForge.Controller;
import jakarta.servlet.http.HttpSession;
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
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getSessionStatus(HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        Boolean isLoggedIn = (Boolean) session.getAttribute("isLoggedIn");

        if (isLoggedIn != null && isLoggedIn) {
            response.put("isLoggedIn", true);
            response.put("userId", session.getAttribute("userId"));
            response.put("role", session.getAttribute("role"));
            response.put("profilePic", session.getAttribute("profilePic"));
            response.put("userName", session.getAttribute("userName"));
        } else {
            response.put("isLoggedIn", false);
        }
        return ResponseEntity.ok(response);
    }
}
