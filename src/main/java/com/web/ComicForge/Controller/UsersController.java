package com.web.ComicForge.Controller;
import com.web.ComicForge.DTO.UserDTO;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Service.UsuarioService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/admin")
@AllArgsConstructor

public class UsersController {
    private final UsuarioService userService;

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        List<Usuario> users = userService.getAllUser();
        return users.stream()
                .map(user -> new UserDTO(user.getId(), user.getUserName(), user.getEmail()))
                .toList();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUserById(id);
        if (deleted) return ResponseEntity.ok("Usuario eliminado");
        return ResponseEntity.status(404).body("Usuario no encontrado");
    }
}
