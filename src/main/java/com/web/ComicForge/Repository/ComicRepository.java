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
}
