package Controller;
import Service.PersonajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping({"/", "/personajes"})

public class PersonajeController {

    private final PersonajeService personajeService;

    @GetMapping("/personajes")
    public String mostrarPaginaPersonajes(Model model) {
        model.addAttribute("personajes", personajeService.cargarPersonajes());
        return "personajes";
    }
}