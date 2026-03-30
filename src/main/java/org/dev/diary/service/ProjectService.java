package org.dev.diary.service;

import org.dev.diary.model.entity.Project;
import org.dev.diary.model.enums.ProjectStatus;
import org.dev.diary.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAll() {
        return projectRepository.findAll();
    }

    public List<Project> getByStatus(ProjectStatus status) {
        return projectRepository.findByStatus(status);
    }

    public Project create(String name) {
        if (projectRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("Project already exists: " + name);
        }
        return projectRepository.save(new Project(name));
    }

    public Optional<Project> update(Long id, Project updates) {
        return projectRepository.findById(id).map(p -> {
            if (updates.getName() != null && !updates.getName().isBlank()) {
                p.setName(updates.getName());
            }
            if (updates.getStatus() != null) {
                p.setStatus(updates.getStatus());
            }
            return projectRepository.save(p);
        });
    }

    public boolean delete(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /** Find by name or create as ACTIVE — used during backfill. */
    public Project ensureProject(String name) {
        return projectRepository.findByName(name)
                .orElseGet(() -> projectRepository.save(new Project(name)));
    }
}

