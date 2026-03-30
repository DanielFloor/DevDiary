package org.dev.diary.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "links")
public class Link {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String url;

    private String label;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id")
    @JsonIgnore
    private DiaryEntry entry;

    public Link() {}

    public Link(Long id, String url, String label, DiaryEntry entry) {
        this.id = id;
        this.url = url;
        this.label = label;
        this.entry = entry;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public DiaryEntry getEntry() { return entry; }
    public void setEntry(DiaryEntry entry) { this.entry = entry; }
}
