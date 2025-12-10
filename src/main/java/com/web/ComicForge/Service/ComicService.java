package com.web.ComicForge.Service;
import com.web.ComicForge.DTO.ComicFormDTO;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Repository.ComicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor

public class ComicService {
    private static final String CARPETA_COMICS = "archivosComics/";
    private final ComicRepository comicRepository;

    public List<Comic> listarTodos() {
        return comicRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public List<Comic> findAllByIds(List<Long> ids) {
        return comicRepository.findAllById(ids);
    }

    public List<Comic> getComicsByUserId(Long userId) {
        return comicRepository.findByUserId(userId);
    }

    public List<Comic> getComicsByCategoria(String categoria) {
        return comicRepository.findByCategory(categoria);
    }

    public boolean existsById(Long id) {
        return comicRepository.existsById(id);
    }

    public void guardarComicConArchivos(ComicFormDTO dto) throws IOException {

        Files.createDirectories(Paths.get(CARPETA_COMICS));

        String safeTitle = dto.getTitle().trim().replaceAll("[^a-zA-Z0-9\\-]", "_").toLowerCase();

        String imageExt = Objects.requireNonNull(dto.getComicImage().getOriginalFilename()).substring(dto.getComicImage().getOriginalFilename().lastIndexOf("."));
        String imageFileName = safeTitle + "_img" + imageExt;
        Files.copy(dto.getComicImage().getInputStream(),
        Paths.get(CARPETA_COMICS + imageFileName),
        StandardCopyOption.REPLACE_EXISTING);

        String pdfExt = Objects.requireNonNull(dto.getComicPDF().getOriginalFilename()).substring(dto.getComicPDF().getOriginalFilename().lastIndexOf("."));
        String pdfFileName = safeTitle + "_comic" + pdfExt;
        Files.copy(dto.getComicPDF().getInputStream(),
        Paths.get(CARPETA_COMICS + pdfFileName),
        StandardCopyOption.REPLACE_EXISTING);

        Comic comic = new Comic();
        comic.setTitle(dto.getTitle());
        comic.setDescription(dto.getDescription());
        comic.setPrice(dto.getPrice());
        comic.setPublisher(dto.getPublisher());
        comic.setCategory(dto.getCategory());
        comic.setDiscountPercent(dto.getDiscountPercent());
        comic.setImageSRC("/archivosComics/" + imageFileName);
        comic.setLinkComic("/archivosComics/" + pdfFileName);

        comicRepository.save(comic);
    }

    public Optional<Comic> getComicById(Long id) {
        return comicRepository.findById(id);
    }

    public boolean existesById(Long id) {
        return comicRepository.existsById(id);
    }

    public boolean isDriveLink(String link) {
        return link != null && (link.contains("drive.google.com"));
    }

    public boolean isLocalFile(String link) {
        return link != null && (
                link.startsWith("/archivosComics/") ||
                link.startsWith("archivosComics/") ||
                link.startsWith("/recursos/") ||
                link.startsWith("recursos/")
        );
    }

    public String convertDriveLinkToPreview(String driveLink) {
        if (driveLink == null || driveLink.isEmpty()) {
            return null;
        }

        if (driveLink.contains("/preview")) {
            return driveLink;
        }

        Pattern pattern = Pattern.compile("/d/([a-zA-Z0-9_-]+)");
        Matcher matcher = pattern.matcher(driveLink);

        if (matcher.find()) {
            String fileId = matcher.group(1);
            return "https://drive.google.com/file/d/" + fileId + "/preview";
        }

        return driveLink;
    }

    public String processComicLink(String link) {
        if (link == null || link.isEmpty()) {
            return null;
        }

        if (isDriveLink(link)) {
            return convertDriveLinkToPreview(link);
        } else if (isLocalFile(link)) {
            if (link.startsWith("archivosComics/")) {
                return "/" + link;
            } else if (!link.startsWith("/archivosComics/")) {
                return "/archivosComics/" + link;
            }
            return link;
        }
        return link;
    }

    public String getLinkType(String link) {
        if (link == null || link.isEmpty()) {
            return "none";
        }
        if (isDriveLink(link)) {
            return "drive";
        } else if (isLocalFile(link)) {
            return "local";
        } else {
            return "external";
        }
    }

    public Comic actualizarComic(Long id, Comic comicActualizado) {
        Comic comicExistente = comicRepository.findById(id).orElseThrow(() -> new RuntimeException("Comic no encontrado"));
        comicExistente.setTitle(comicActualizado.getTitle());
        comicExistente.setDescription(comicActualizado.getDescription());
        comicExistente.setPrice(comicActualizado.getPrice());
        comicExistente.setDiscountPercent(comicActualizado.getDiscountPercent());
        return comicRepository.save(comicExistente);
    }

    public void eliminarComic(Long id) {
        Comic comicExiste = comicRepository.findById(id).orElseThrow(() -> new RuntimeException("Comic no encontrado"));
        comicRepository.delete(comicExiste);
    }
}
