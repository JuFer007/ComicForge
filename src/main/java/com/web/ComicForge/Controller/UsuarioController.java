package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Service.ComicService;
import com.web.ComicForge.Service.UsuarioService;
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
    public String userProfile(@PathVariable Long id, Model model) {
        Usuario user = userService.getUserByID(id).orElse(null);
        if (user == null) {
            return "redirect:/";
        }
        model.addAttribute("user", user);
        return "userProfile";
    }

    @PostMapping("/profile/{id}/edit")
    public ResponseEntity<Void> updateUserProfile(
            @PathVariable Long id,
            @RequestParam String userName,
            @RequestParam String userBio,
            @RequestParam String profilePicture,
            @RequestParam String coverImageURL) {

        Optional<Usuario> optionalUser = userService.getUserByID(id);

        if (optionalUser.isPresent()) {
            Usuario user = optionalUser.get();
            user.setUserName(userName);
            user.setUserBio(userBio);
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
    public ResponseEntity<List<Comic>> getUserComics(@PathVariable Long id) {
        List<Comic> comics = comicService.getComicsByUserId(id);
        return ResponseEntity.ok(comics);
    }

    @GetMapping("/{userId}/favoritos")
    public ResponseEntity<List<Comic>> getFavoritos(@PathVariable Long userId){
        List<Comic> favoritos = userService.getUserFavorites(userId);
        return ResponseEntity.ok(favoritos);
    }

    @PostMapping("/{userId}/favoritos/add/{comicId}")
    public ResponseEntity<String> addFavorito(
            @PathVariable Long userId,
            @PathVariable Long comicId) {
        boolean added = userService.addComicToFavorites(userId, comicId);
        if (!added) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("El cómic ya está en favoritos");
        }
        return ResponseEntity.ok("Agregado a favoritos");
    }
}
