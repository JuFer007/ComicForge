package com.web.ComicForge.Controller;
import com.web.ComicForge.DTO.DashboardStatsDTO;
import com.web.ComicForge.Service.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor

public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/admin/dashboard-stats")
    public DashboardStatsDTO getDashboardStats() {
        return dashboardService.getStats();
    }

    @GetMapping("/top-comics")
    public List<Map<String, Object>> getTopComics() {
        return dashboardService.obtenerTopComics();
    }

    @GetMapping("/publishers")
    public Map<String, Long> getComicsPorPublisher() {
        return dashboardService.obtenerComicsPorPublisher();
    }
}
