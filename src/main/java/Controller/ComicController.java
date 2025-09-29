package Controller;
import Model.ComicDescuent;
import Service.ComicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Collections;
import java.util.List;

@Controller
public class ComicController {

    @Autowired
    private ComicService comicService;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("marvelComics", comicService.cargarComics("marvel"));
        model.addAttribute("dcComics", comicService.cargarComics("dc"));
        model.addAttribute("dragonballMangas", comicService.cargarComics("dragon-ball"));
        model.addAttribute("masVendidos", comicService.cargarMasVendidos());
        return "index";
    }

    @GetMapping("/descuentos")
    public String getDescuentos(Model model, @RequestParam(name = "page", defaultValue = "1") int page) {
        int comicsLimit = 2;
        List<ComicDescuent> todosLosDescuentos = comicService.cargarDescuentos();

        int totalItems = todosLosDescuentos.size();
        int totalPages = (int) Math.ceil((double) totalItems / comicsLimit);
        int currentPage = Math.max(1, Math.min(page, totalPages));

        int start = (currentPage - 1) * comicsLimit;
        int end = Math.min(start + comicsLimit, totalItems);

        List<ComicDescuent> descuentosPaginados = (start < end) ? todosLosDescuentos.subList(start, end) : Collections.emptyList();

        model.addAttribute("descuentos", descuentosPaginados);
        model.addAttribute("currentPage", currentPage - 1);
        model.addAttribute("totalPages", totalPages);
        return "descuentos";
    }
}
