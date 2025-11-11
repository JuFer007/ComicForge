package com.web.ComicForge.Controller;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class PageController {
    @GetMapping("/login")
    public String mostrarLogin() {
        return "login";
    }

    @GetMapping("/registro")
    public String mostrarRegistro() {
        return "registro";
    }

    @GetMapping("/descuentos")
    public String mostrarDescuentos() {
        return "descuentos";
    }

    @GetMapping("/")
    public String mostrarHome() {
        return "index";
    }

    @GetMapping("/admin")
    public String adminPage() {
        return "admin";
    }

    @GetMapping("/read")
    public String leerComic() {
        return "lectorComic";
    }
}
