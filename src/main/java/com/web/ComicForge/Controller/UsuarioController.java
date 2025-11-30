package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Service.ComicService;
import com.web.ComicForge.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/user")
@RequiredArgsConstructor
public class UsuarioController {
    private final UsuarioService userService;
    private final ComicService comicService;

    @GetMapping("/profile/{id}")
    public String userProfile(@PathVariable Long id, Model model, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("userId");

        if (loggedUserId == null || !loggedUserId.equals(id)) {
            return "redirect:/login";
        }

        Usuario user = userService.getUserByID(id).orElse(null);
        if (user == null) {
            return "redirect:/";
        }
        model.addAttribute("user", user);
        return "userProfile";
    }

    @PostMapping("/profile/{id}/edit")
    @ResponseBody
    public ResponseEntity<Void> updateUserProfile(
            @PathVariable Long id,
            @RequestParam String userName,
            @RequestParam String userBio,
            @RequestParam String profilePicture,
            @RequestParam String coverImageURL,
            HttpSession session) {

        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null || !loggedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (userName == null || userName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Optional<Usuario> optionalUser = userService.getUserByID(id);

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            user.setUserName(userName.trim());
            user.setUserBio(userBio != null ? userBio.trim() : "");
            user.setProfilePicture(profilePicture);
            user.setCoverImageURL(coverImageURL);
            userService.guardarUsuario(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/profile/{id}/comics")
    @ResponseBody
    public ResponseEntity<List<Comic>> getUserComics(@PathVariable Long id, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null || !loggedUserId.equals(id)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Comic> comics = comicService.getComicsByUserId(id);
        return ResponseEntity.ok(comics);
    }

    @GetMapping("/{userId}/favoritos")
    @ResponseBody
    public ResponseEntity<List<Comic>> getFavoritos(@PathVariable Long userId, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null || !loggedUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Comic> favoritos = userService.getUserFavorites(userId);
        return ResponseEntity.ok(favoritos);
    }

    @PostMapping("/{userId}/favoritos/add/{comicId}")
    @ResponseBody
    public ResponseEntity<String> addFavorito(@PathVariable Long userId, @PathVariable Long comicId, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null || !loggedUserId.equals(userId)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No autorizado");
        }

        boolean added = userService.addComicToFavorites(userId, comicId);
        if (!added) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El cómic ya está en favoritos");
        }
        return ResponseEntity.ok("Agregado a favoritos");
    }
}
