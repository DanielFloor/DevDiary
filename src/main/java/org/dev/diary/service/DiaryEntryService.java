package org.dev.diary.service;

import org.dev.diary.model.entity.DiaryEntry;
import org.dev.diary.model.entity.Link;
import org.dev.diary.model.entity.Tag;
import org.dev.diary.repository.DiaryEntryRepository;
import org.dev.diary.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class DiaryEntryService {

    private final DiaryEntryRepository entryRepository;
    private final TagRepository tagRepository;

    public DiaryEntryService(DiaryEntryRepository entryRepository, TagRepository tagRepository) {
        this.entryRepository = entryRepository;
        this.tagRepository = tagRepository;
    }

    public List<DiaryEntry> getAllEntries(List<String> projects, List<String> tags, LocalDate from, LocalDate to) {
        if (tags != null && !tags.isEmpty()) {
            return entryRepository.findByTagNameIn(tags);
        }
        if (projects != null && !projects.isEmpty()) {
            return entryRepository.findByProjectIn(projects);
        }
        if (from != null && to != null) {
            return entryRepository.findByDateBetween(from, to);
        }
        return entryRepository.findAll();
    }

    public Optional<DiaryEntry> getEntryById(Long id) {
        return entryRepository.findById(id);
    }

    public List<DiaryEntry> searchEntries(String q) {
        return entryRepository.searchByContent(q);
    }

    @Transactional
    public DiaryEntry createEntry(DiaryEntry entry) {
        resolveTagsInPlace(entry);
        wireLinkParents(entry);
        return entryRepository.save(entry);
    }

    @Transactional
    public Optional<DiaryEntry> updateEntry(Long id, DiaryEntry updated) {
        return entryRepository.findById(id).map(existing -> {
            existing.setDate(updated.getDate());
            existing.setProject(updated.getProject());
            existing.setContent(updated.getContent());
            existing.setMood(updated.getMood());

            resolveTagsInPlace(updated);
            existing.getTags().clear();
            existing.getTags().addAll(updated.getTags());

            existing.getLinks().clear();
            if (updated.getLinks() != null) {
                for (Link link : updated.getLinks()) {
                    link.setEntry(existing);
                    existing.getLinks().add(link);
                }
            }

            return entryRepository.save(existing);
        });
    }

    @Transactional
    public boolean deleteEntry(Long id) {
        if (entryRepository.existsById(id)) {
            entryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // ---- helpers ----

    private void resolveTagsInPlace(DiaryEntry entry) {
        if (entry.getTags() == null) return;
        List<Tag> resolved = new ArrayList<>();
        for (Tag t : entry.getTags()) {
            Tag persisted = tagRepository.findByName(t.getName())
                    .orElseGet(() -> tagRepository.save(new Tag(null, t.getName())));
            resolved.add(persisted);
        }
        entry.getTags().clear();
        entry.getTags().addAll(resolved);
    }

    private void wireLinkParents(DiaryEntry entry) {
        if (entry.getLinks() == null) return;
        entry.getLinks().forEach(link -> link.setEntry(entry));
    }
}
