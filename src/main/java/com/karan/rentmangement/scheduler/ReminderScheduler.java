package com.karan.rentmangement.scheduler;

import com.karan.rentmangement.service.ReminderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class ReminderScheduler {

    private static final Logger log = LoggerFactory.getLogger(ReminderScheduler.class);

    private final ReminderService reminderService;

    public ReminderScheduler(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    /**
     * DEMO SCHEDULE: Fires once at 9:04 PM IST (15:34 UTC) on 2026-06-19.
     *
     * After the client demo, replace with production schedule:
     *   @Scheduled(cron = "0 0 10 * * ?")   → Every day at 10:00 AM IST
     */
    @Scheduled(cron = "0 34 15 19 6 ?")  // 9:04 PM IST = 15:34 UTC, June 19
    public void runDemoReminderJob() {
        log.info("===== RENT REMINDER JOB STARTED =====");
        try {
            Map<String, Object> result = reminderService.sendDueReminders();

            int count = (int) result.get("notifiedCount");
            log.info("Reminders dispatched. Total notified: {}", count);
            log.info("===== RENT REMINDER JOB COMPLETED =====");

        } catch (Exception e) {
            log.error("Reminder job failed", e);
        }
    }
}
