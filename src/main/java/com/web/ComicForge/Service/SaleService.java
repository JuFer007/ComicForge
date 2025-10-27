package com.web.ComicForge.Service;
import com.web.ComicForge.Model.Comic;
import com.web.ComicForge.Model.DetailSale;
import com.web.ComicForge.Model.Sale;
import com.web.ComicForge.Model.User;
import com.web.ComicForge.Repository.ComicRepository;
import com.web.ComicForge.Repository.DetailSaleRepository;
import com.web.ComicForge.Repository.SaleRepository;
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

    public Sale crearVenta(User user, List<Long> comicsIDs) {
        if (comicsIDs == null || comicsIDs.isEmpty()) {
            throw new IllegalArgumentException("El carrito esta vacio");
        }

        List<Comic> comics = comicRepository.findAllById(comicsIDs);
        double total = comics.stream().mapToDouble(Comic :: getPrice).sum();
        Sale sale = new Sale();
        sale.setUser(user);
        sale.setSaleDate(new Date());
        sale.setTotalAmount(total);

        List<DetailSale> detalles = new ArrayList<>();
        for (Comic comic : comics) {
            DetailSale detalle = new DetailSale();
            detalle.setSale(sale);
            detalle.setComic(comic);
            detalles.add(detalle);
        }
        sale.setDetailSale(detalles);
        return saleRepository.save(sale);
    }
}
