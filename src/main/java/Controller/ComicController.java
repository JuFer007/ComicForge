package Controller;
import Service.ComicService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping({"/", "/index"})

public class ComicController {
    private final ComicService comicService;

    @GetMapping
    public String paginaPrincipal(Model model) {
        model.addAttribute("marvelComics", comicService.cargarComics("marvel"));
        model.addAttribute("dcComics", comicService.cargarComics("dc"));
        model.addAttribute("dragonballMangas", comicService.cargarComics("dragonball"));
        model.addAttribute("masVendidos", comicService.cargarMasVendidos());
        return "index";
    }
}
