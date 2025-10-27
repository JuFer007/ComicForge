package com.web.ComicForge.Controller;
import com.web.ComicForge.DTO.DashboardStatsDTO;
import com.web.ComicForge.Service.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor

public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/admin/dashboard-stats")
    public DashboardStatsDTO getDashboardStats() {
        return dashboardService.getStats();
    }
}
