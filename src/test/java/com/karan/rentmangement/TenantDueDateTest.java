package com.karan.rentmangement;

import com.karan.rentmangement.DTO.RequestDTO.TenantRequestDTO;
import com.karan.rentmangement.DTO.ResponseDTO.TenantResponseDTO;
import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.repository.TenantRepo;
import com.karan.rentmangement.service.ReminderService;
import com.karan.rentmangement.service.TenantService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class TenantDueDateTest {

    @Autowired
    private TenantService tenantService;

    @Autowired
    private ReminderService reminderService;


    @Autowired
    private TenantRepo tenantRepo;

    @Autowired
    private LandlordRepo landlordRepo;

    @Autowired
    private PropertyRepo propertyRepo;

    private RestTemplate mockRestTemplate;
    private Landlord landlord;
    private Property property;

    @BeforeEach
    public void setUp() {
        // Mock RestTemplate to prevent any external SMS calls
        mockRestTemplate = Mockito.mock(RestTemplate.class);
        ReflectionTestUtils.setField(reminderService, "restTemplate", mockRestTemplate);

        // Create a landlord
        landlord = new Landlord("Landlord 1", "landlord1@gmail.com", "9876543210", "pass123");
        landlord = landlordRepo.save(landlord);

        // Create a property
        property = new Property();
        property.setAddress("123 Main St");
        property.setCity("Mumbai");
        property.setType("Apartment");
        property.setRent(15000L);
        property.setLandlord(landlord);
        property = propertyRepo.save(property);
    }

    @Test
    public void testCreateTenantWithDueDateSuccess() {
        TenantRequestDTO dto = new TenantRequestDTO();
        dto.setName("John Doe");
        dto.setEmail("john@gmail.com");
        dto.setPhone("9999999999");
        dto.setRent(15000L);
        dto.setMoveInDate(LocalDate.now());
        dto.setDueDate(LocalDate.now().plusDays(5));
        dto.setLandlord_id(landlord.getId());
        dto.setProperty_id(property.getId());
        dto.setStatus("ACTIVE");

        TenantResponseDTO response = tenantService.createTenant(dto);
        assertNotNull(response);
        assertEquals(dto.getDueDate(), response.getDueDate());

        // Retrieve from database and verify
        Tenant tenant = tenantRepo.findById(response.getId()).orElse(null);
        assertNotNull(tenant);
        assertEquals(dto.getDueDate(), tenant.getDueDate());
    }

    @Test
    public void testCreateTenantValidationDueDateBeforeMoveIn() {
        TenantRequestDTO dto = new TenantRequestDTO();
        dto.setName("Invalid Tenant");
        dto.setEmail("invalid@gmail.com");
        dto.setPhone("9999999999");
        dto.setRent(15000L);
        dto.setMoveInDate(LocalDate.now());
        dto.setDueDate(LocalDate.now().minusDays(1)); // Due date before move-in date
        dto.setLandlord_id(landlord.getId());
        dto.setProperty_id(property.getId());
        dto.setStatus("ACTIVE");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            tenantService.createTenant(dto);
        });
        assertEquals("Rent due date cannot be before move-in date", exception.getMessage());
    }

    @Test
    @SuppressWarnings("unchecked")
    public void testReminderTriggeredCorrectlyBasedOnDueDate() {
        // Set up a tenant whose due date is exactly 5 days from today
        Tenant tenant = new Tenant();
        tenant.setName("Due Tenant");
        tenant.setEmail("due@gmail.com");
        tenant.setPhone("9876543210");
        tenant.setRent(15000L);
        tenant.setMoveInDate(LocalDate.now().minusMonths(1));
        tenant.setDueDate(LocalDate.now().plusDays(5));
        tenant.setStatus("ACTIVE");
        tenant.setLandlord(landlord);
        tenant.setProperty(property);
        tenantRepo.save(tenant);

        // Set up a tenant whose move-in date matches, but the due date is not in range
        Tenant notDueTenant = new Tenant();
        notDueTenant.setName("Not Due Tenant");
        notDueTenant.setEmail("notdue@gmail.com");
        notDueTenant.setPhone("9876543211");
        notDueTenant.setRent(15000L);
        notDueTenant.setMoveInDate(LocalDate.now().minusMonths(1));
        notDueTenant.setDueDate(LocalDate.now().plusDays(15));
        notDueTenant.setStatus("ACTIVE");
        notDueTenant.setLandlord(landlord);
        notDueTenant.setProperty(property);
        tenantRepo.save(notDueTenant);

        // Run reminders
        Map<String, Object> result = reminderService.sendDueReminders();
        assertNotNull(result);

        List<Map<String, Object>> notifiedTenants = (List<Map<String, Object>>) result.get("notifiedTenants");
        boolean foundDue = false;
        boolean foundNotDue = false;
        for (Map<String, Object> info : notifiedTenants) {
            if ("Due Tenant".equals(info.get("name"))) {
                foundDue = true;
            }
            if ("Not Due Tenant".equals(info.get("name"))) {
                foundNotDue = true;
            }
        }
        assertTrue(foundDue, "The due tenant should have been notified");
        assertFalse(foundNotDue, "The not due tenant should not have been notified");
    }

    @Test
    @SuppressWarnings("unchecked")
    public void testReminderSkipsTenantWithNullDueDateWithoutError() {
        // Save a tenant with null due date directly to repo
        Tenant legacyTenant = new Tenant();
        legacyTenant.setName("Legacy Tenant");
        legacyTenant.setEmail("legacy@gmail.com");
        legacyTenant.setPhone("9876543212");
        legacyTenant.setRent(15000L);
        legacyTenant.setMoveInDate(LocalDate.now().minusDays(10));
        legacyTenant.setDueDate(null);
        legacyTenant.setStatus("ACTIVE");
        legacyTenant.setLandlord(landlord);
        legacyTenant.setProperty(property);
        legacyTenant = tenantRepo.saveAndFlush(legacyTenant);

        assertNull(legacyTenant.getDueDate());

        // Run reminders - should run cleanly without throwing any exceptions
        Map<String, Object> result = assertDoesNotThrow(() -> reminderService.sendDueReminders());
        assertNotNull(result);

        // Verify that the legacy tenant was NOT notified
        List<Map<String, Object>> notifiedTenants = (List<Map<String, Object>>) result.get("notifiedTenants");
        boolean foundLegacy = false;
        for (Map<String, Object> info : notifiedTenants) {
            if ("Legacy Tenant".equals(info.get("name"))) {
                foundLegacy = true;
            }
        }
        assertFalse(foundLegacy, "Legacy tenant with null dueDate should be skipped");
    }
}
