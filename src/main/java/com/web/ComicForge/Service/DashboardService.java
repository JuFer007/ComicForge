package com.web.ComicForge.Service;
import com.web.ComicForge.DTO.DashboardStatsDTO;
import com.web.ComicForge.Repository.ComicRepository;
import com.web.ComicForge.Repository.SaleRepository;
import com.web.ComicForge.Repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor

public class DashboardService {
    private final ComicRepository comicRepository;
    private final UserRepository userRepository;
    private final SaleRepository saleRepository;

    public DashboardStatsDTO getStats() {
        long totalComics = comicRepository.count();
        long totalUsers = userRepository.count();
        Double totalSales = saleRepository.sumTotalAmount();
        if (totalSales == null) totalSales = 0.0;
        return new DashboardStatsDTO(totalComics, totalUsers, totalSales);
    }
}
