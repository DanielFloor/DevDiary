package org.dev.diary.service;

import org.dev.diary.model.entity.Tag;
import org.dev.diary.model.enums.ProjectStatus;
import org.dev.diary.repository.TagRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<Tag> getAll() {
        return tagRepository.findAll();
    }

    public List<Tag> getByStatus(ProjectStatus status) {
        return tagRepository.findByStatus(status);
    }

    public Tag create(String name) {
        if (tagRepository.findByName(name).isPresent()) {
            throw new IllegalArgumentException("Tag already exists: " + name);
        }
        Tag tag = new Tag(null, name);
        tag.setStatus(ProjectStatus.ACTIVE);
        return tagRepository.save(tag);
    }

    public Optional<Tag> update(Long id, Tag updates) {
        return tagRepository.findById(id).map(t -> {
            if (updates.getName() != null && !updates.getName().isBlank()) {
                t.setName(updates.getName());
            }
            if (updates.getStatus() != null) {
                t.setStatus(updates.getStatus());
            }
            return tagRepository.save(t);
        });
    }
}

