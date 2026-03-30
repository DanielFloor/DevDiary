package org.dev.diary.config;

import org.dev.diary.model.enums.ProjectStatus;
import org.dev.diary.repository.DiaryEntryRepository;
import org.dev.diary.repository.ProjectRepository;
import org.dev.diary.repository.TagRepository;
import org.dev.diary.service.ProjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataBackfillRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataBackfillRunner.class);

    private final DiaryEntryRepository entryRepository;
    private final ProjectService projectService;
    private final TagRepository tagRepository;

    public DataBackfillRunner(DiaryEntryRepository entryRepository,
                              ProjectService projectService,
                              TagRepository tagRepository) {
        this.entryRepository = entryRepository;
        this.projectService = projectService;
        this.tagRepository = tagRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Backfill distinct project names from diary entries into the projects table
        List<String> distinctProjects = entryRepository.findDistinctProjects();
        int projectsCreated = 0;
        for (String name : distinctProjects) {
            projectService.ensureProject(name);
            projectsCreated++;
        }
        log.info("DataBackfill: ensured {} project(s) in projects table", projectsCreated);

        // Fix any tags that have a null status (existing rows before the status column was added)
        long fixed = tagRepository.findAll().stream()
                .filter(t -> t.getStatus() == null)
                .peek(t -> {
                    t.setStatus(ProjectStatus.ACTIVE);
                    tagRepository.save(t);
                })
                .count();
        log.info("DataBackfill: set {} tag(s) to ACTIVE status", fixed);
    }
}

