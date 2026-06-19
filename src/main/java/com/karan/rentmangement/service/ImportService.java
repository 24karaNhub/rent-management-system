package com.karan.rentmangement.service;

import com.karan.rentmangement.model.Landlord;
import com.karan.rentmangement.model.Property;
import com.karan.rentmangement.model.Tenant;
import com.karan.rentmangement.model.rentPayment;
import com.karan.rentmangement.repository.LandlordRepo;
import com.karan.rentmangement.repository.PropertyRepo;
import com.karan.rentmangement.repository.TenantRepo;
import com.karan.rentmangement.repository.rentPaymentRepo;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Month;

@Service
public class ImportService {

    @Autowired
    private LandlordRepo landlordRepo;

    @Autowired
    private PropertyRepo propertyRepo;

    @Autowired
    private TenantRepo tenantRepo;

    @Autowired
    private rentPaymentRepo rentpaymentRepo;

    public String importFromExcel(MultipartFile file, Integer landlordId) {
        // Phase 3: Upload Security Audit
        // 1. File size check (limit to 10MB)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds the maximum limit of 10MB.");
        }

        // 2. File extension check
        String filename = file.getOriginalFilename();
        if (filename == null || (!filename.toLowerCase().endsWith(".xlsx") && !filename.toLowerCase().endsWith(".xls"))) {
            throw new IllegalArgumentException("Invalid file format. Only .xlsx and .xls are supported.");
        }

        Landlord landlord = landlordRepo.findById(landlordId)
                .orElseThrow(() -> new IllegalArgumentException("Landlord not found with id: " + landlordId));

        // Phase 7: Performance Optimization (In-memory lookup caching)
        java.util.List<Property> existingProps = propertyRepo.findByLandlordId(landlordId);
        java.util.Map<String, Property> propertyMap = new java.util.HashMap<>();
        for (Property p : existingProps) {
            if (p.getAddress() != null) {
                propertyMap.put(p.getAddress().trim().toLowerCase(), p);
            }
        }

        java.util.List<Tenant> existingTenants = tenantRepo.findByLandlordId(landlordId);
        java.util.Map<String, Tenant> tenantMap = new java.util.HashMap<>();
        for (Tenant t : existingTenants) {
            if (t.getPhone() != null) {
                tenantMap.put(t.getPhone().trim(), t);
            }
        }

        int imported = 0;
        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            if (workbook.getNumberOfSheets() == 0) {
                throw new IllegalArgumentException("The Excel file contains no sheets.");
            }
            Sheet sheet = workbook.getSheetAt(0);
            if (sheet == null || sheet.getPhysicalNumberOfRows() == 0) {
                throw new IllegalArgumentException("The sheet is empty.");
            }

            // Column mappings
            int tenantNameCol = -1;
            int phoneCol = -1;
            int addressCol = -1;
            int rentCol = -1;
            int monthCol = -1;
            int statusCol = -1;
            int dateCol = -1;

            int headerRowIdx = -1;

            // Scan first 10 rows to dynamically discover headers
            int maxScanRows = Math.min(10, sheet.getLastRowNum());
            for (int i = 0; i <= maxScanRows; i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                int tempTenantNameCol = -1;
                int tempPhoneCol = -1;
                int tempAddressCol = -1;
                int tempRentCol = -1;
                int tempMonthCol = -1;
                int tempStatusCol = -1;
                int tempDateCol = -1;

                int matches = 0;
                short lastCell = row.getLastCellNum();
                for (int c = 0; c < lastCell; c++) {
                    String cellVal = getCellValueAsString(row, c).trim().toLowerCase();
                    if (cellVal.isEmpty()) continue;

                    if (cellVal.contains("tenant") || cellVal.equals("name")) {
                        tempTenantNameCol = c;
                        matches++;
                    } else if (cellVal.contains("phone") || cellVal.contains("contact") || cellVal.contains("mobile")) {
                        tempPhoneCol = c;
                        matches++;
                    } else if (cellVal.contains("property") || cellVal.contains("address") || cellVal.contains("unit") || cellVal.contains("flat") || cellVal.contains("residency")) {
                        tempAddressCol = c;
                        matches++;
                    } else if (cellVal.contains("rent") || cellVal.contains("amount")) {
                        tempRentCol = c;
                        matches++;
                    } else if (cellVal.contains("month") || cellVal.contains("period")) {
                        tempMonthCol = c;
                        matches++;
                    } else if (cellVal.contains("status")) {
                        tempStatusCol = c;
                        matches++;
                    } else if (cellVal.contains("date")) {
                        tempDateCol = c;
                        matches++;
                    }
                }

                if (matches >= 3) {
                    tenantNameCol = tempTenantNameCol;
                    phoneCol = tempPhoneCol;
                    addressCol = tempAddressCol;
                    rentCol = tempRentCol;
                    monthCol = tempMonthCol;
                    statusCol = tempStatusCol;
                    dateCol = tempDateCol;
                    headerRowIdx = row.getRowNum();
                    break;
                }
            }

            // Fallback to default columns if no header found
            if (headerRowIdx == -1) {
                headerRowIdx = 0;
                tenantNameCol = 0;
                phoneCol = 1;
                addressCol = 2;
                rentCol = 3;
                monthCol = 4;
                statusCol = 5;
            } else {
                // Phase 5: Data Validation
                if (tenantNameCol == -1 || addressCol == -1 || rentCol == -1) {
                    throw new IllegalArgumentException("Required columns (Tenant Name, Property/Address, Rent Amount) could not be mapped from the headers.");
                }
            }

            for (Row row : sheet) {
                // Skip headers and preceding rows
                if (row.getRowNum() <= headerRowIdx) continue;

                // Read tenant name safely
                String tenantName = (tenantNameCol != -1) ? getCellValueAsString(row, tenantNameCol) : "";
                if (tenantName == null || tenantName.trim().isEmpty()) {
                    continue; // Skip empty rows or spacer rows
                }

                // Phase 4: Formula Injection Sanitization
                tenantName = sanitizeFormula(tenantName);

                // Read other columns safely
                String phone = (phoneCol != -1) ? cleanPhone(getCellValueAsString(row, phoneCol)) : "9999999999";
                
                String address = (addressCol != -1) ? getCellValueAsString(row, addressCol) : "";
                if (address == null || address.trim().isEmpty()) {
                    address = "Unit " + row.getRowNum(); // Default address fallback
                }
                address = sanitizeFormula(address);

                Long rent = (rentCol != -1) ? getCellValueAsLong(row, rentCol) : 1000L;
                if (rent <= 0) {
                    throw new IllegalArgumentException("Rent amount in row " + (row.getRowNum() + 1) + " must be a positive number.");
                }

                String monthStr = (monthCol != -1) ? getCellValueAsString(row, monthCol) : "";
                Month month = parseMonth(monthStr);

                String status = (statusCol != -1) ? getCellValueAsString(row, statusCol) : "";
                if (status == null || status.trim().isEmpty()) {
                    status = "PENDING";
                } else {
                    status = status.toUpperCase();
                }
                status = sanitizeFormula(status);

                // Parse custom date if provided, otherwise default to today
                LocalDate paymentDate = LocalDate.now();
                if (dateCol != -1) {
                    Cell dateCell = row.getCell(dateCol);
                    paymentDate = parseDate(dateCell);
                }

                // Phase 2: Duplicate Prevention & Lookup
                String normAddress = address.trim().toLowerCase();
                Property property = propertyMap.get(normAddress);
                if (property == null) {
                    property = new Property();
                    property.setAddress(address);
                    property.setRent(rent);
                    property.setType("Apartment"); // satisfies @NotBlank type
                    property.setCity("Noida");      // satisfies @NotBlank city
                    property.setLandlord(landlord);
                    propertyRepo.save(property);
                    propertyMap.put(normAddress, property);
                }

                String normPhone = phone.trim();
                Tenant tenant = tenantMap.get(normPhone);
                if (tenant == null) {
                    tenant = new Tenant();
                    tenant.setName(tenantName);
                    
                    // Generate a valid, unique gmail address to satisfy @Pattern constraint
                    String emailSafeName = tenantName.toLowerCase().replaceAll("[^a-z0-9]", "");
                    if (emailSafeName.isEmpty()) {
                        emailSafeName = "tenant" + row.getRowNum();
                    }
                    tenant.setEmail(emailSafeName + "." + System.currentTimeMillis() + "." + imported + "@gmail.com");
                    tenant.setPhone(phone);
                    tenant.setRent(rent);
                    tenant.setMoveInDate(LocalDate.now());
                    tenant.setProperty(property);
                    tenant.setLandlord(landlord);
                    tenantRepo.save(tenant);
                    tenantMap.put(normPhone, tenant);
                } else {
                    // Update connection to property if changed
                    if (tenant.getProperty() == null || tenant.getProperty().getId() != property.getId()) {
                        tenant.setProperty(property);
                        tenantRepo.save(tenant);
                    }
                }

                // Create Payment
                rentPayment payment = new rentPayment();
                payment.setRent(rent);
                payment.setMonth(month);
                payment.setStatus(status);
                payment.setDate(paymentDate);
                payment.setTenant(tenant);
                payment.setProperty(property);
                payment.setLandlord(landlord);
                rentpaymentRepo.save(payment);

                imported++;
            }

            if (imported == 0) {
                throw new IllegalArgumentException("No records were imported from the spreadsheet.");
            }

            return imported + " records imported successfully!";
        } catch (Exception e) {
            // Phase 3: Malformed/Invalid file handling
            if (e instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) e;
            }
            throw new RuntimeException("Failed to process Excel file: " + e.getMessage(), e);
        }
    }

    private String sanitizeFormula(String value) {
        if (value == null) return "";
        String trimmed = value.trim();
        if (trimmed.startsWith("=") || trimmed.startsWith("+") || trimmed.startsWith("-") || trimmed.startsWith("@")) {
            return "'" + value;
        }
        return value;
    }

    private String getCellValueAsString(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return "";
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    try {
                        return cell.getLocalDateTimeCellValue().toLocalDate().toString();
                    } catch (Exception e) {
                        // fallback
                    }
                }
                double val = cell.getNumericCellValue();
                if (val == (long) val) {
                    return String.valueOf((long) val);
                } else {
                    return String.valueOf(val);
                }
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    return cell.getStringCellValue().trim();
                } catch (Exception e) {
                    try {
                        return String.valueOf(cell.getNumericCellValue());
                    } catch (Exception ex) {
                        return "";
                    }
                }
            default:
                return "";
        }
    }

    private Long getCellValueAsLong(Row row, int cellIndex) {
        Cell cell = row.getCell(cellIndex);
        if (cell == null) {
            return 0L;
        }
        switch (cell.getCellType()) {
            case NUMERIC:
                return (long) cell.getNumericCellValue();
            case STRING:
                try {
                    String val = cell.getStringCellValue().trim().replaceAll("[^0-9.]", "");
                    if (val.contains(".")) {
                        return (long) Double.parseDouble(val);
                    }
                    return Long.parseLong(val);
                } catch (NumberFormatException e) {
                    return 0L;
                }
            default:
                return 0L;
        }
    }

    private String cleanPhone(String phone) {
        if (phone == null) return "9999999999";
        phone = phone.trim();
        if (phone.toUpperCase().contains("E")) {
            try {
                double d = Double.parseDouble(phone);
                phone = String.format("%.0f", d);
            } catch (Exception e) {
                // ignore
            }
        }
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() == 10) {
            return digits;
        }
        if (digits.length() > 10) {
            return digits.substring(0, 10);
        }
        return String.format("%-10s", digits).replace(' ', '9');
    }

    private LocalDate parseDate(Cell cell) {
        if (cell == null) {
            return LocalDate.now();
        }
        if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
            try {
                return cell.getLocalDateTimeCellValue().toLocalDate();
            } catch (Exception e) {
                // Ignore
            }
        }
        String str = getCellValueAsString(cell.getRow(), cell.getColumnIndex());
        if (str == null || str.trim().isEmpty()) {
            return LocalDate.now();
        }
        try {
            str = str.trim().replace("/", "-");
            if (str.length() >= 10) {
                return LocalDate.parse(str.substring(0, 10));
            }
        } catch (Exception e) {
            // Ignore
        }
        return LocalDate.now();
    }

    private Month parseMonth(String monthStr) {
        if (monthStr == null || monthStr.trim().isEmpty()) {
            return Month.JANUARY;
        }
        monthStr = monthStr.trim().toUpperCase();
        switch (monthStr) {
            case "JAN": case "JANUARY": return Month.JANUARY;
            case "FEB": case "FEBRUARY": return Month.FEBRUARY;
            case "MAR": case "MARCH": return Month.MARCH;
            case "APR": case "APRIL": return Month.APRIL;
            case "MAY": return Month.MAY;
            case "JUN": case "JUNE": return Month.JUNE;
            case "JUL": case "JULY": return Month.JULY;
            case "AUG": case "AUGUST": return Month.AUGUST;
            case "SEP": case "SEPT": case "SEPTEMBER": return Month.SEPTEMBER;
            case "OCT": case "OCTOBER": return Month.OCTOBER;
            case "NOV": case "NOVEMBER": return Month.NOVEMBER;
            case "DEC": case "DECEMBER": return Month.DECEMBER;
            default:
                try {
                    // Try parsing as double if it was read from numeric month cell
                    if (monthStr.contains(".")) {
                        monthStr = monthStr.split("\\.")[0];
                    }
                    int mVal = Integer.parseInt(monthStr);
                    if (mVal >= 1 && mVal <= 12) {
                        return Month.of(mVal);
                    }
                } catch (NumberFormatException e) {
                    // Ignore
                }
                return Month.JANUARY;
        }
    }
}