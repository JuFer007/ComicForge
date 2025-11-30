package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Service.ComicService;
import com.web.ComicForge.Service.SaleService;
import com.web.ComicForge.Service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/cart")
@RequiredArgsConstructor

public class CartController {
    private final ComicService comicService;
    private final SaleService saleService;
    private final UsuarioService usuarioService;

    @GetMapping
    public String showCart(Model model, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null) {
            return "redirect:/login";
        }

        List<Long> cart = (List<Long>) session.getAttribute("cart");
        if (cart == null) cart = new ArrayList<>();

        var comics = comicService.findAllByIds(cart);
        double total = comics.stream().mapToDouble(c -> c.getPrice()).sum();

        model.addAttribute("comics", comics);
        model.addAttribute("total", total);
        return "cart";
    }

    @PostMapping("/add")
    @ResponseBody
    public ResponseEntity<String> addToCart(@RequestParam Long comicID, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Debe iniciar sesión para agregar al carrito");
        }

        Usuario usuario = usuarioService.getUserByID(loggedUserId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        boolean yaComprado = usuario.getPurchasedComics().stream()
                .anyMatch(comic -> comic.getId().equals(comicID));

        if (yaComprado) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ya posees este cómic en tu colección");
        }

        if (!comicService.existsById(comicID)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Cómic no encontrado");
        }

        List<Long> cart = (List<Long>) session.getAttribute("cart");
        if (cart == null) cart = new ArrayList<>();

        if (cart.contains(comicID)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Este cómic ya está en tu carrito");
        }

        cart.add(comicID);
        session.setAttribute("cart", cart);

        return ResponseEntity.ok("Cómic agregado al carrito exitosamente");
    }

    @PostMapping("/checkout")
    public String checkout(HttpSession session, Model model) {
        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null) {
            return "redirect:/login";
        }

        List<Long> cart = (List<Long>) session.getAttribute("cart");
        if (cart == null || cart.isEmpty()) {
            return "redirect:/cart?empty";
        }

        Usuario user = usuarioService.getUserByID(loggedUserId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Long> comicsYaComprados = cart.stream()
                .filter(comicId -> user.getPurchasedComics().stream()
                        .anyMatch(c -> c.getId().equals(comicId)))
                .toList();

        if (!comicsYaComprados.isEmpty()) {
            model.addAttribute("error", "Algunos cómics ya los posees");
            return "redirect:/cart?error=already_owned";
        }

        saleService.crearVenta(user, cart);
        session.removeAttribute("cart");

        return "redirect:/cart/success";
    }

    @GetMapping("/success")
    public String successPage() {
        return "sale_success";
    }

    @PostMapping("/remove/{id}")
    public String removeFromCart(@PathVariable Long id, HttpSession session) {
        List<Long> cart = (List<Long>) session.getAttribute("cart");
        if (cart != null) {
            cart.removeIf(comicId -> comicId.equals(id));
            session.setAttribute("cart", cart);
        }
        return "redirect:/cart";
    }
}