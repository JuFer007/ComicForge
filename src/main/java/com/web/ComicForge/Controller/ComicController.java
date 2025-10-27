package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Service.ComicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController

public class ComicController {
    @Autowired
    private ComicService comicService;

    @GetMapping("/comics/{categoria}")
    public List<Comic> listarPorCategoria(@PathVariable String categoria) {
        return comicService.getComicsByCategoria(categoria);
    }

    @PostMapping("/addComic")
    public Map<String, String> addComic(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam String publisher,
            @RequestParam String category,
            @RequestParam MultipartFile comicImage,
            @RequestParam MultipartFile comicPDF,
            @RequestParam(required = false) Integer discountPercent
    ) throws IOException {

        comicService.guardarComicConArchivos(title, description, price, publisher, category, discountPercent, comicImage, comicPDF);

        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Cómic agregado correctamente");
        return response;
    }
}
