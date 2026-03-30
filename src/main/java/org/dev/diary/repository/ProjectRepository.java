package org.dev.diary.repository;

import org.dev.diary.model.entity.Project;
import org.dev.diary.model.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByStatus(ProjectStatus status);
    Optional<Project> findByName(String name);
}

