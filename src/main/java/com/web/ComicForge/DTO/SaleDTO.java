package com.web.ComicForge.DTO;
import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SaleDTO {
    private Long id;
    private String userName;
    private List<String> comics;
    private Date saleDate;
    private double totalAmount;
}
