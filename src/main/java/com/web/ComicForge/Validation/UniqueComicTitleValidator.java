package com.web.ComicForge.Validation;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Repository.ComicRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component

public class UniqueComicTitleValidator implements ConstraintValidator<UniqueComicTitle, Comic> {
    private static ComicRepository comicRepository;

    @Autowired
    public void setComicRepository(ComicRepository repo) {
        UniqueComicTitleValidator.comicRepository = repo;
    }

    @Override
    public boolean isValid(Comic comic, ConstraintValidatorContext context) {
        if (comic == null || comic.getTitle() == null || comic.getTitle().trim().isEmpty()) {
            return true;
        }

        var existenteOpt = comicRepository.findByTitleIgnoreCase(comic.getTitle().trim());

        if (existenteOpt.isEmpty()) {
            return true;
        }

        var existente = existenteOpt.get();
        return existente.getId().equals(comic.getId());
    }
}
