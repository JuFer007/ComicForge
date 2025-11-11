package com.web.ComicForge.Controller;
import com.web.ComicForge.DTO.ComicFormDTO;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Service.ComicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/comics")

public class ComicController {
    @Autowired
    private ComicService comicService;

    @GetMapping("/todos")
    public List<Comic> listarTodos() {
        return comicService.listarTodos();
    }

    @GetMapping("/{categoria}")
    public List<Comic> listarPorCategoria(@PathVariable String categoria) {
        return comicService.getComicsByCategoria(categoria);
    }

    @PostMapping("/addComic")
    public Map<String, String> addComic(@Valid @ModelAttribute ComicFormDTO dto,
                                        BindingResult result
    ) throws IOException {

        Map<String, String> response = new HashMap<>();

        if(result.hasErrors()){
            response.put("status", "error");
            response.put("message", result.getAllErrors().get(0).getDefaultMessage());
            return response;
        }

        comicService.guardarComicConArchivos(dto);

        response.put("status", "success");
        response.put("message", "Cómic agregado correctamente");
        return response;
    }

    @PutMapping("/editar/{id}")
    public Map<String, String> editarComic(@PathVariable Long id, @RequestBody @Valid Comic comicActualizado, BindingResult result) {
        Map<String, String> response = new HashMap<>();

        if (result.hasErrors()) {
            response.put("status", "error");
            response.put("message", result.getAllErrors().get(0).getDefaultMessage());
            return response;
        }

        try {
            comicService.actualizarComic(id, comicActualizado);
            response.put("status", "success");
            response.put("message", "Cómic actualizado correctamente");
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }

    @DeleteMapping("/eliminar/{id}")
    public Map<String, String> eliminarComic(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        try {
            comicService.eliminarComic(id);
            response.put("status", "success");
            response.put("message", "Cómic eliminado correctamente");
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
        }
        return response;
    }
}
