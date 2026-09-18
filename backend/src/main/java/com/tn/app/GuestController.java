package com.tn.app;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/guests")
public class GuestController {

    private final GuestRepository repository;

    public GuestController(GuestRepository repository) {
        this.repository = repository;
    }

    // Đăng ký tham dự
    @PostMapping
    public ResponseEntity<Guest> create(@Valid @RequestBody Guest guest) {
        Guest saved = repository.save(guest);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // Lấy danh sách người đã đăng ký (mới nhất trước)
    @GetMapping
    public List<Guest> list() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    // Thống kê nhanh: tổng số người đăng ký
    @GetMapping("/count")
    public Map<String, Long> count() {
        return Map.of("total", repository.count());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
