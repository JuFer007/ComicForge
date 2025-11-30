package com.web.ComicForge.Controller;
import com.web.ComicForge.DTO.ComicFormDTO;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Service.ComicService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @ResponseBody
    public ResponseEntity<Map<String, String>> addComic(@Valid @ModelAttribute ComicFormDTO dto, BindingResult result) throws IOException {
        Map<String, String> response = new HashMap<>();

        if (result.hasErrors()) {
            response.put("status", "error");
            response.put("message", result.getAllErrors().get(0).getDefaultMessage());
            return ResponseEntity.badRequest().body(response);
        }

        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "El título es obligatorio");
            return ResponseEntity.badRequest().body(response);
        }

        if (dto.getPrice() == null || dto.getPrice() < 1) {
            response.put("status", "error");
            response.put("message", "El precio debe ser al menos 1 sol");
            return ResponseEntity.badRequest().body(response);
        }

        if (dto.getComicImage() == null || dto.getComicImage().isEmpty()) {
            response.put("status", "error");
            response.put("message", "La imagen del cómic es obligatoria");
            return ResponseEntity.badRequest().body(response);
        }

        if (dto.getComicPDF() == null || dto.getComicPDF().isEmpty()) {
            response.put("status", "error");
            response.put("message", "El archivo PDF del cómic es obligatorio");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            comicService.guardarComicConArchivos(dto);
            response.put("status", "success");
            response.put("message", "Cómic agregado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Error al guardar el cómic: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PutMapping("/editar/{id}")
    @ResponseBody
    public ResponseEntity<Map<String, String>> editarComic(@PathVariable Long id, @RequestBody @Valid Comic comicActualizado, BindingResult result) {
        Map<String, String> response = new HashMap<>();

        if (result.hasErrors()) {
            response.put("status", "error");
            response.put("message", result.getAllErrors().get(0).getDefaultMessage());
            return ResponseEntity.badRequest().body(response);
        }

        if (comicActualizado.getTitle() == null || comicActualizado.getTitle().trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "El título no puede estar vacío");
            return ResponseEntity.badRequest().body(response);
        }

        if (comicActualizado.getPrice() == null || comicActualizado.getPrice() < 1) {
            response.put("status", "error");
            response.put("message", "El precio debe ser al menos 1 sol");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            comicService.actualizarComic(id, comicActualizado);
            response.put("status", "success");
            response.put("message", "Cómic actualizado correctamente");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
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
