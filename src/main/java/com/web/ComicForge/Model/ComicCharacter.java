package com.web.ComicForge.Model;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class ComicCharacter {
    @NotBlank(message = "Tiene que tener imagen")
    private String image;

    @NotBlank(message = "El nickname es obligatorio")
    private String nickName;

    @NotBlank(message = "La descripcion no puede estar vacia")
    private String description;

    @NotBlank(message = "Los poderes no deben estar vacios")
    private String power;

    @NotBlank(message = "No puede tener equipos en blanco")
    private String teams;
}
