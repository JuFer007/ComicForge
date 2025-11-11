package com.web.ComicForge.DTO;
import com.web.ComicForge.Validation.UniqueComicTitle;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@UniqueComicTitle
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ComicFormDTO {
    private Long id;
    
    @NotBlank(message = "El título no puede estar vacío")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    @Min(value = 1, message = "El precio debe ser al menos 1 sol")
    private Double price;

    @NotBlank(message = "La editorial es obligatoria")
    private String publisher;

    @Min(value = 0, message = "El descuento no puede ser negativo")
    private Integer discountPercent;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;

    private MultipartFile comicImage;
    private MultipartFile comicPDF;
}
