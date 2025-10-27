package com.web.ComicForge.Controller;
import com.web.ComicForge.Model.ComicCharacter;
import com.web.ComicForge.Service.CharacterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@Controller

public class CharacterController {
    @Autowired
    private CharacterService characterService;

    @GetMapping("/personajes")
    public String personajesPage(Model model) {
        List<ComicCharacter> personajes = characterService.getAllCharacters();
        model.addAttribute("personajes", personajes);
        return "personajes";
    }
}
