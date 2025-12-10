package com.web.ComicForge.Service;
import com.web.ComicForge.DTO.DashboardStatsDTO;
import com.web.ComicForge.Repository.ComicRepository;
import com.web.ComicForge.Repository.SaleRepository;
import com.web.ComicForge.Repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@AllArgsConstructor

public class DashboardService {
    private final ComicRepository comicRepository;
    private final UsuarioRepository userRepository;
    private final SaleRepository saleRepository;

    public DashboardStatsDTO getStats() {
        long totalComics = comicRepository.count();
        long totalUsers = userRepository.count();
        Double totalSales = saleRepository.sumTotalAmount();
        if (totalSales == null) totalSales = 0.0;
        return new DashboardStatsDTO(totalComics, totalUsers, totalSales);
    }

    public List<Map<String, Object>> obtenerTopComics() {
        List<Object[]> results = comicRepository.findTop5ComicsMasVendidos();
        List<Map<String, Object>> topComics = new ArrayList<>();

        int limit = Math.min(results.size(), 5);
        for (int i = 0; i < limit; i++) {
            Object[] row = results.get(i);
            Map<String, Object> comicData = new HashMap<>();
            comicData.put("title", row[0]);
            comicData.put("totalVentas", row[1]);
            topComics.add(comicData);
        }

        return topComics;
    }

    // Método corregido para Publishers
    public Map<String, Long> obtenerComicsPorPublisher() {
        List<Object[]> results = comicRepository.countComicsByPublisher();
        Map<String, Long> publishers = new LinkedHashMap<>();

        for (Object[] row : results) {
            String publisher = (String) row[0];
            Long cantidad = (Long) row[1];
            publishers.put(publisher, cantidad);
        }

        return publishers;
    }
}
