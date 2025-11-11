package com.web.ComicForge.Repository;
import com.web.ComicForge.Model.Comic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComicRepository extends JpaRepository<Comic, Long> {
    @Query("SELECT ds.comic FROM DetailSale ds WHERE ds.sale.user.id = :userId")
    List<Comic> findByUserId(Long userId);
    List<Comic> findByCategory(String category);
    Optional<Comic> findByTitleIgnoreCase(String title);
    @Query("SELECT c.publisher, COUNT(c) FROM Comic c GROUP BY c.publisher")
    List<Object[]> countComicsByPublisher();
    @Query("SELECT c.title, COUNT(ds.id) as totalVentas FROM DetailSale ds JOIN ds.comic c GROUP BY c.title ORDER BY totalVentas DESC")
    List<Object[]> findTop5ComicsMasVendidos();
}
