package com.karan.rentmangement;

import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.repository.TenantRepo;
import com.karan.rentmangement.repository.rentPaymentRepo;
import com.karan.rentmangement.service.ImportService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class ImportServiceTest {

    @Autowired
    private ImportService importService;

    @Autowired
    private LandlordRepo landlordRepo;

    @Autowired
    private PropertyRepo propertyRepo;

    @Autowired
    private TenantRepo tenantRepo;

    @Autowired
    private rentPaymentRepo rentPaymentRepo;

    @Test
    public void testImportWithExistingEntities() throws Exception {
        // 1. Setup Landlord
        Landlord landlord = new Landlord("Test Landlord", "test.landlord@gmail.com", "9999999999", "password123");
        landlord = landlordRepo.save(landlord);
        int landlordId = landlord.getId();

        // 2. Setup Existing Property
        Property property = new Property();
        property.setAddress("Flat 101, Noida");
        property.setRent(12000L);
        property.setType("Apartment");
        property.setCity("Noida");
        property.setLandlord(landlord);
        property = propertyRepo.save(property);

        // 3. Setup Existing Tenant linked to the property and landlord
        Tenant tenant = new Tenant();
        tenant.setName("John Doe");
        tenant.setEmail("john.doe@gmail.com");
        tenant.setPhone("9876543210");
        tenant.setRent(12000L);
        tenant.setMoveInDate(LocalDate.now());
        tenant.setProperty(property);
        tenant.setLandlord(landlord);
        tenant = tenantRepo.save(tenant);

        // Record initial counts
        long initialPropertyCount = propertyRepo.count();
        long initialTenantCount = tenantRepo.count();
        long initialPaymentCount = rentPaymentRepo.count();

        System.out.println("\n========================================");
        System.out.println("=== INITIAL DATABASE COUNTS ===");
        System.out.println("Properties: " + initialPropertyCount);
        System.out.println("Tenants:    " + initialTenantCount);
        System.out.println("Payments:   " + initialPaymentCount);
        System.out.println("========================================\n");

        // 4. Create sample Excel file in memory with:
        // - Existing tenant name & phone
        // - Existing property address
        // - New rent payment
        byte[] excelBytes = createExcelFile("John Doe", "9876543210", "Flat 101, Noida", 12000, "FEBRUARY", "PAID", "2026-02-15");
        MockMultipartFile file = new MockMultipartFile("file", "import-test.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", excelBytes);

        // 5. Run Import
        String result = importService.importFromExcel(file, landlordId);
        System.out.println("Import Service Output: " + result);

        // 6. Verify Results after import
        long postPropertyCount = propertyRepo.count();
        long postTenantCount = tenantRepo.count();
        long postPaymentCount = rentPaymentRepo.count();

        System.out.println("\n========================================");
        System.out.println("=== POST-IMPORT DATABASE COUNTS ===");
        System.out.println("Properties: " + postPropertyCount);
        System.out.println("Tenants:    " + postTenantCount);
        System.out.println("Payments:   " + postPaymentCount);
        System.out.println("========================================\n");

        // Assert that counts of Property and Tenant have not increased (since they existed and were reused)
        assertEquals(initialPropertyCount, postPropertyCount, "No new property should be created.");
        assertEquals(initialTenantCount, postTenantCount, "No new tenant should be created.");
        // Assert that exactly one new rentPayment was created
        assertEquals(initialPaymentCount + 1, postPaymentCount, "Exactly one new rent payment should be created.");

        // Verify the created payment links to the existing property and tenant
        List<rentPayment> payments = rentPaymentRepo.findAll();
        rentPayment newPayment = payments.get(payments.size() - 1);
        assertEquals(property.getId(), newPayment.getProperty().getId(), "Payment should link to the existing property.");
        assertEquals(tenant.getid(), newPayment.getTenant().getid(), "Payment should link to the existing tenant.");
        assertEquals("PAID", newPayment.getStatus(), "Payment status should be PAID.");
    }
    @Test
    public void testImportWithNewEntities() throws Exception{
        Landlord landlord = new Landlord("test2 landlord","test2@gmail.com","9999988888","password123");
        landlord=landlordRepo.save(landlord);
        int landlordId=landlord.getId();
        long initialPropertyCount=propertyRepo.count();
        long initialTenantCount=tenantRepo.count();
        long initialPaymentCount=rentPaymentRepo.count();
         System.out.println("\n========================================");
        System.out.println("=== BEFORE IMPORT ===");

        System.out.println("Properties: " + initialPropertyCount);

        System.out.println("Tenants: " + initialTenantCount);

        System.out.println("Payments: " + initialPaymentCount);

        System.out.println("========================================");
        byte[] excelBytes=createExcelFile("Test User XYZ", "1112223334", "Test Flat 999", 15000, "JUNE", "PAID", "2026-06-19");
         MockMultipartFile file = new MockMultipartFile(

            "file",

            "new-import.xlsx",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

            excelBytes

    );
    String result = importService.importFromExcel(file, landlordId);

    System.out.println("Import Result: " + result);

    long postPropertyCount = propertyRepo.count();

    long postTenantCount = tenantRepo.count();

    long postPaymentCount = rentPaymentRepo.count();

    System.out.println("\n========================================");

    System.out.println("=== AFTER IMPORT ===");

    System.out.println("Properties: " + postPropertyCount);

    System.out.println("Tenants: " + postTenantCount);

    System.out.println("Payments: " + postPaymentCount);

    System.out.println("========================================");

    // Verify new entities were created

    assertEquals(

            initialPropertyCount + 1,

            postPropertyCount,

            "One new property should be created."

    );

    assertEquals(

            initialTenantCount + 1,

            postTenantCount,

            "One new tenant should be created."

    );

    assertEquals(

            initialPaymentCount + 1,

            postPaymentCount,

            "One new payment should be created."

    );

    // Verify tenant exists

    Tenant tenant = tenantRepo

            .findByPhoneAndLandlordId("1112223334", landlordId)

            .orElse(null);

    assertNotNull(tenant);

    assertEquals("Test User XYZ", tenant.getName());

    // Verify property exists

    Property property = propertyRepo

            .findByAddressAndLandlordId("Test Flat 999", landlordId)

            .orElse(null);

    assertNotNull(property);


}

    private byte[] createExcelFile(String name, String phone, String address, double rent, String month, String status, String date) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Import Test");
            
            // Header Row
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Tenant Name");
            header.createCell(1).setCellValue("Phone");
            header.createCell(2).setCellValue("Property Address");
            header.createCell(3).setCellValue("Rent Amount");
            header.createCell(4).setCellValue("Month");
            header.createCell(5).setCellValue("Status");
            header.createCell(6).setCellValue("Payment Date");

            // Data Row
            Row dataRow = sheet.createRow(1);
            dataRow.createCell(0).setCellValue(name);
            dataRow.createCell(1).setCellValue(phone);
            dataRow.createCell(2).setCellValue(address);
            dataRow.createCell(3).setCellValue(rent);
            dataRow.createCell(4).setCellValue(month);
            dataRow.createCell(5).setCellValue(status);
            dataRow.createCell(6).setCellValue(date);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos.toByteArray();
        }
    }
}
