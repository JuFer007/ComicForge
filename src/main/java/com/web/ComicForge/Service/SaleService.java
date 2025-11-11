package com.web.ComicForge.Service;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Model.DetailSale;
import com.web.ComicForge.Model.Sale;
import com.web.ComicForge.Model.Usuario;
import com.web.ComicForge.Repository.ComicRepository;
import com.web.ComicForge.Repository.DetailSaleRepository;
import com.web.ComicForge.Repository.SaleRepository;
import com.web.ComicForge.Repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor

public class SaleService {
    private final SaleRepository saleRepository;
    private final DetailSaleRepository detailSaleRepository;
    private final ComicRepository comicRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public Sale crearVenta(Usuario usuario, List<Long> comicsIDs) {
        if (comicsIDs == null || comicsIDs.isEmpty()) {
            throw new IllegalArgumentException("El carrito está vacio");
        }

        List<Comic> comics = comicRepository.findAllById(comicsIDs);
        double total = comics.stream().mapToDouble(Comic::getPrice).sum();

        Sale sale = new Sale();
        sale.setUser(usuario);
        sale.setSaleDate(new Date());
        sale.setTotalAmount(total);

        List<DetailSale> detalles = new ArrayList<>();
        for (Comic comic : comics) {
            DetailSale detailSale = new DetailSale();
            detailSale.setSale(sale);
            detailSale.setComic(comic);
            detalles.add(detailSale);

            if (!usuario.getPurchasedComics().contains(comic)) {
                usuario.getPurchasedComics().add(comic);
            }
        }
        sale.setDetailSale(detalles);
        usuarioRepository.save(usuario);
        return saleRepository.save(sale);
    }
}
