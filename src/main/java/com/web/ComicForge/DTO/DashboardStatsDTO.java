package com.web.ComicForge.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class DashboardStatsDTO {
    private long totalComics;
    private long totalUsers;
    private double totalSales;
}
