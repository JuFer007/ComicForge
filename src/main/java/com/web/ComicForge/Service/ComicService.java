package com.web.ComicForge.Service;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Repository.ComicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor

public class ComicService {
    private static final String CARPETA_COMICS = "archivosComics/";
    private final ComicRepository comicRepository;

    public List<Comic> findAllByIds(List<Long> ids) {
        return comicRepository.findAllById(ids);
    }

    public List<Comic> getComicsByUserId(Long userId) {
        return comicRepository.findByUserId(userId);
    }

    public List<Comic> getComicsByCategoria(String categoria) {
        return comicRepository.findByCategory(categoria);
    }

    public void guardarComicConArchivos(
            String title,
            String description,
            Double price,
            String publisher,
            String category,
            Integer discountPercent,
            MultipartFile comicImage,
            MultipartFile comicPDF
    ) throws IOException {

        Files.createDirectories(Paths.get(CARPETA_COMICS));

        String safeTitle = title.trim().replaceAll("[^a-zA-Z0-9\\-]", "_").toLowerCase();

        String imageExt = Objects.requireNonNull(comicImage.getOriginalFilename()).substring(comicImage.getOriginalFilename().lastIndexOf("."));
        String imageFileName = safeTitle + "_img" + imageExt;
        Path imagePath = Paths.get(CARPETA_COMICS + imageFileName);
        Files.copy(comicImage.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        String pdfExt = Objects.requireNonNull(comicPDF.getOriginalFilename()).substring(comicPDF.getOriginalFilename().lastIndexOf("."));
        String pdfFileName = safeTitle + "_comic" + pdfExt;
        Path pdfPath = Paths.get(CARPETA_COMICS + pdfFileName);
        Files.copy(comicPDF.getInputStream(), pdfPath, StandardCopyOption.REPLACE_EXISTING);

        Comic comic = new Comic();
        comic.setTitle(title);
        comic.setDescription(description);
        comic.setPrice(price);
        comic.setPublisher(publisher);
        comic.setCategory(category);
        comic.setDiscountPercent(discountPercent);
        comic.setImageSRC("/archivosComics/" + imageFileName);
        comic.setLinkComic("/archivosComics/" + pdfFileName);

        comicRepository.save(comic);
    }
}
