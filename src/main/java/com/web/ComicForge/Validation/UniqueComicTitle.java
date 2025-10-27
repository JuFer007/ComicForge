package com.web.ComicForge.Validation;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = UniqueComicTitleValidator.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)

public @interface UniqueComicTitle {
    String message() default "Ya existe un cómic con este título";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
