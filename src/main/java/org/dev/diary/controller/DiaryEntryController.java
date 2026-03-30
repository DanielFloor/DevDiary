package org.dev.diary.controller;

import org.dev.diary.model.entity.DiaryEntry;
import org.dev.diary.service.DiaryEntryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/entries")
@CrossOrigin(origins = "*")
public class DiaryEntryController {

    private final DiaryEntryService service;

    public DiaryEntryController(DiaryEntryService service) {
        this.service = service;
    }

    @GetMapping
    public List<DiaryEntry> getEntries(
            @RequestParam(required = false) List<String> project,
            @RequestParam(required = false) List<String> tag,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return service.getAllEntries(project, tag, from, to);
    }

    @GetMapping("/search")
    public List<DiaryEntry> search(@RequestParam String q) {
        return service.searchEntries(q);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiaryEntry> getById(@PathVariable Long id) {
        return service.getEntryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<DiaryEntry> create(@RequestBody DiaryEntry entry) {
        DiaryEntry saved = service.createEntry(entry);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DiaryEntry> update(@PathVariable Long id, @RequestBody DiaryEntry entry) {
        return service.updateEntry(id, entry)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.deleteEntry(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
