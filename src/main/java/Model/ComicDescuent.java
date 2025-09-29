package Model;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter

public class ComicDescuent extends Comic {
    private String discountPercent;
    private String newPrice;
    private List<String> characters;
}
