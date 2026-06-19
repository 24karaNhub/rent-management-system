package com.karan.rentmangement.service;

import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.repository.TenantRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReminderService {

    private static final Logger log = LoggerFactory.getLogger(ReminderService.class);

    private final TenantRepo tenantRepo;
    private final RestTemplate restTemplate;

    @Value("${fast2sms.api.key}")
    private String apiKey;

    public ReminderService(TenantRepo tenantRepo) {
        this.tenantRepo = tenantRepo;
        this.restTemplate = new RestTemplate();
    }

    public Map<String, Object> sendDueReminders() {
        List<Tenant> tenants = tenantRepo.findAll();
        LocalDate today = LocalDate.now();
        List<Map<String, Object>> notifiedTenants = new ArrayList<>();

        for (Tenant tenant : tenants) {
            // Only notify active tenants with valid phone numbers and due dates
            if (tenant.getDueDate() == null || tenant.getPhone() == null || !"ACTIVE".equalsIgnoreCase(tenant.getStatus())) {
                continue;
            }

            LocalDate dueDate = tenant.getDueDate();
            long daysUntilDue = ChronoUnit.DAYS.between(today, dueDate);

            // Filter tenants whose rent is due within 5 to 6 days
            if (daysUntilDue >= 5 && daysUntilDue <= 6) {
                String messageText = "Dear " + tenant.getName() + ", your rent of Rs." + tenant.getRent() + " is due on " + dueDate + " (" + daysUntilDue + " days remaining).";
                
                try {
                    log.info("Sending reminder to {} ({})", tenant.getName(), tenant.getPhone());
                    URI uri = UriComponentsBuilder.fromHttpUrl("https://www.fast2sms.com/dev/bulkV2")
                            .queryParam("authorization", apiKey)
                            .queryParam("route", "q")
                            .queryParam("message", messageText)
                            .queryParam("numbers", tenant.getPhone())
                            .build()
                            .toUri();

                    restTemplate.getForObject(uri, String.class);
                    log.info("SMS sent successfully to {} | Due: {} | Days left: {}", tenant.getName(), dueDate, daysUntilDue);

                    Map<String, Object> info = new HashMap<>();
                    info.put("tenantId", tenant.getid());
                    info.put("name", tenant.getName());
                    info.put("phone", tenant.getPhone());
                    info.put("daysUntilDue", daysUntilDue);
                    info.put("dueDate", dueDate.toString());
                    notifiedTenants.add(info);
                } catch (Exception e) {
                    log.error("Failed to send SMS to {} ({}): {}", tenant.getName(), tenant.getPhone(), e.getMessage());
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("notifiedCount", notifiedTenants.size());
        result.put("notifiedTenants", notifiedTenants);
        return result;
    }
}
