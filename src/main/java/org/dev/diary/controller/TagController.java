package org.dev.diary.controller;

import org.dev.diary.model.entity.Tag;
import org.dev.diary.model.enums.ProjectStatus;
import org.dev.diary.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public List<Tag> getAll(@RequestParam(required = false) ProjectStatus status) {
        if (status != null) return tagService.getByStatus(status);
        return tagService.getAll();
    }

    @PostMapping
    public ResponseEntity<Tag> create(@RequestBody Map<String, String> body) {
        try {
            Tag t = tagService.create(body.get("name"));
            return ResponseEntity.status(HttpStatus.CREATED).body(t);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tag> update(@PathVariable Long id, @RequestBody Tag updates) {
        return tagService.update(id, updates)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

