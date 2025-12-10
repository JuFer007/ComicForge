package com.web.ComicForge.Controller;
import com.web.ComicForge.DTO.SaleDTO;
import com.web.ComicForge.Service.SaleService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/sales")
@AllArgsConstructor

public class SaleController {
    private final SaleService saleService;

    @GetMapping
    public List<SaleDTO> getAllSales() {
        return saleService.getAllSalesDTO();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportToExcel() {
        byte[] data = saleService.exportSalesToExcel();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ventas_detalladas.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }
}
