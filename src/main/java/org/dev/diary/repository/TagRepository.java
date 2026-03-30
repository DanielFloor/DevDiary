package org.dev.diary.repository;

import org.dev.diary.model.entity.Tag;
import org.dev.diary.model.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);
    List<Tag> findByStatus(ProjectStatus status);
}

