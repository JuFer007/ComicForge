package com.web.ComicForge.Validation;
import com.web.ComicForge.DTO.ComicFormDTO;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Repository.ComicRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UniqueComicTitleValidator implements ConstraintValidator<UniqueComicTitle, ComicFormDTO> {

    private final ComicRepository comicRepository;

    @Autowired
    public UniqueComicTitleValidator(ComicRepository comicRepository) {
        this.comicRepository = comicRepository;
    }

    @Override
    public boolean isValid(ComicFormDTO dto, ConstraintValidatorContext context) {
        if (dto == null || dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            return true;
        }

        var existenteOpt = comicRepository.findByTitleIgnoreCase(dto.getTitle().trim());

        if (existenteOpt.isPresent()) {
            Comic existente = existenteOpt.get();
            if (dto.getId() != null && dto.getId().equals(existente.getId())) {
                return true;
            }
            
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Ya existe un cómic con este título")
                    .addPropertyNode("title")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
