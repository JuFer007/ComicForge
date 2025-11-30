package com.web.ComicForge.Controller;
import com.web.ComicForge.DTO.DashboardStatsDTO;
import com.web.ComicForge.Service.DashboardService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/admin/dashboard-stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        try {
            DashboardStatsDTO stats = dashboardService.getStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            // Log del error
            System.err.println("Error obteniendo stats: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/top-comics")
    public ResponseEntity<List<Map<String, Object>>> getTopComics() {
        try {
            List<Map<String, Object>> topComics = dashboardService.obtenerTopComics();
            return ResponseEntity.ok(topComics);
        } catch (Exception e) {
            System.err.println("Error obteniendo top comics: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/publishers")
    public ResponseEntity<Map<String, Long>> getComicsPorPublisher() {
        try {
            Map<String, Long> publishers = dashboardService.obtenerComicsPorPublisher();
            return ResponseEntity.ok(publishers);
        } catch (Exception e) {
            System.err.println("Error obteniendo publishers: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}