package com.web.ComicForge.Service;
import com.web.ComicForge.DTO.SaleDTO;
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
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<SaleDTO> getAllSalesDTO() {
        List<Sale> sales = saleRepository.findAll();
        List<SaleDTO> salesDTO = new ArrayList<>();

        for (Sale sale : sales) {
            String userName = sale.getUser() != null ? sale.getUser().getUserName() : "N/A";

            List<String> comics = sale.getDetailSale()
                    .stream()
                    .map(d -> d.getComic().getTitle())
                    .collect(Collectors.toList());

            salesDTO.add(new SaleDTO(
                    sale.getId(),
                    userName,
                    comics,
                    sale.getSaleDate(),
                    sale.getTotalAmount()
            ));
        }

        return salesDTO;
    }

    public Sale saveSale(Sale sale) {
        return saleRepository.save(sale);
    }

    public Sale getSaleById(Long id) {
        return saleRepository.findById(id).orElse(null);
    }

    public byte[] exportSalesToExcel() {
        List<SaleDTO> sales = getAllSalesDTO();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Ventas Detalladas");

            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID Venta", "Fecha", "Usuario", "Comics", "Total"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowNum = 1;
            for (SaleDTO sale : sales) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(sale.getId());
                row.createCell(1).setCellValue(sale.getSaleDate().toString());
                row.createCell(2).setCellValue(sale.getUserName());
                row.createCell(3).setCellValue(String.join(", ", sale.getComics()));
                row.createCell(4).setCellValue(sale.getTotalAmount());
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el Excel", e);
        }
    }
}
