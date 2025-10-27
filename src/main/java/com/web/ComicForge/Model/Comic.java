package com.web.ComicForge.Model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comic")

public class Comic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    @NotBlank(message = "El título no puede estar vacío")
    private String title;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    @Column(nullable = false)
    @Min(value = 1, message = "El precio debe ser al menos 1 sol")
    private Double price;

    @Column(nullable = false)
    private String publisher;
    private String imageSRC;
    private String linkComic;

    @Column(nullable = true)
    @Min(value = 0, message = "El descuento no puede ser negativo")
    private Integer discountPercent;

    @Column(nullable = false, length = 50)
    @NotBlank(message = "La categoría es obligatoria")
    private String category;
}
