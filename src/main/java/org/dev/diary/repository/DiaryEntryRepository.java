package org.dev.diary.repository;

import org.dev.diary.model.entity.DiaryEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DiaryEntryRepository extends JpaRepository<DiaryEntry, Long> {

    List<DiaryEntry> findByProject(String project);

    List<DiaryEntry> findByDateBetween(LocalDate from, LocalDate to);

    @Query("SELECT e FROM DiaryEntry e JOIN e.tags t WHERE t.name = :tag")
    List<DiaryEntry> findByTagName(@Param("tag") String tag);

    @Query("SELECT DISTINCT e FROM DiaryEntry e JOIN e.tags t WHERE t.name IN :tags")
    List<DiaryEntry> findByTagNameIn(@Param("tags") List<String> tags);

    List<DiaryEntry> findByProjectIn(List<String> projects);

    @Query("SELECT DISTINCT e.project FROM DiaryEntry e WHERE e.project IS NOT NULL AND e.project <> ''")
    List<String> findDistinctProjects();

    @Query("SELECT e FROM DiaryEntry e WHERE LOWER(e.content) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<DiaryEntry> searchByContent(@Param("q") String q);
}

