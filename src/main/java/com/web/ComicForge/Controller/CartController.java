package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.User;
import com.web.ComicForge.Service.ComicService;
import com.web.ComicForge.Service.SaleService;
import com.web.ComicForge.Service.UserService;
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
    private final UserService userService;

    @GetMapping
    public String showCart(Model model, HttpSession session) {
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
    public ResponseEntity<Void> addToCart(@RequestParam Long comicID, HttpSession session) {
        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Long> cart = (List<Long>) session.getAttribute("cart");
        if (cart == null) cart = new ArrayList<>();

        cart.add(comicID);
        session.setAttribute("cart", cart);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/checkout")
    public String checkout(HttpSession session) {
        List<Long> cart = (List<Long>) session.getAttribute("cart");
        if (cart == null || cart.isEmpty()) return "redirect:/cart?empty";

        Long loggedUserId = (Long) session.getAttribute("userId");
        if (loggedUserId == null) return "redirect:/login";

        User user = userService.getUserByID(loggedUserId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        saleService.crearVenta(user, cart);
        session.removeAttribute("cart");

        return "redirect:/cart/success";
    }

    @GetMapping("/success")
    public String successPage() {
        return "sale_success";
    }

    @PostMapping("/remove/{id}")
    public String removeFromCart(@PathVariable Long id, HttpSession sesion) {
        List<Long> cart = (List<Long>) sesion.getAttribute("cart");
        if (cart != null) {
            cart.removeIf(comicId -> comicId.equals(id));
            sesion.setAttribute("cart", cart);
        }
        return "redirect:/cart";
    }
}