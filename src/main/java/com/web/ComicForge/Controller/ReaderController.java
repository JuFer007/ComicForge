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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/comic/read")
@RequiredArgsConstructor
public class ReaderController {
    private final ComicService comicService;
    private final UsuarioService usuarioService;

    @GetMapping("/{comicId}")
    public String readComic(@PathVariable Long comicId, HttpSession session, Model model) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return "redirect:/login?message=login_required";
        }

        Usuario user = usuarioService.getUserByID(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Comic comic = comicService.getComicById(comicId)
                .orElseThrow(() -> new RuntimeException("Cómic no encontrado"));
        
        String processedLink = comicService.processComicLink(comic.getLinkComic());
        String linkType = comicService.getLinkType(comic.getLinkComic());

        model.addAttribute("comic", comic);
        model.addAttribute("comicLink", processedLink);
        model.addAttribute("linkType", linkType);
        model.addAttribute("user", user);

        return "lectorComic";
    }

    @GetMapping("/check-access/{comicId}")
    @ResponseBody
    public ResponseEntity<Boolean> checkAccess(@PathVariable Long comicId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(false);
        }

        Usuario user = usuarioService.getUserByID(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.ok(false);
        }

        boolean hasAccess = user.getPurchasedComics().stream().anyMatch(c -> c.getId().equals(comicId));

        return ResponseEntity.ok(hasAccess);
    }
}
