package Model;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Comic {
    private String id;
    private String title;
    private String imageSrc;
    private String description;
    private String price;
    private String publisher;
}
