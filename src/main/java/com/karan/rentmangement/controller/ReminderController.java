package com.karan.rentmangement.controller;

import com.karan.rentmangement.service.ReminderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reminders")
public class ReminderController {

    private final ReminderService reminderService;

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendReminders() {
        return ResponseEntity.ok(reminderService.sendDueReminders());
    }
}
