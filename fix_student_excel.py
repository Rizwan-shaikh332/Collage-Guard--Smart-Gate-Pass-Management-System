import openpyxl
from openpyxl.styles import Font, PatternFill

# Create a new workbook
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Students"

# Define headers
headers = ["RegNo", "Name", "Email", "Mobile", "DOB", "Year"]

# Add header row with formatting
header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
header_font = Font(color="FFFFFF", bold=True)

for col, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col)
    cell.value = header
    cell.fill = header_fill
    cell.font = header_font

# Sample data for students
sample_data = [
    ["12101001", "Rahul Sharma", "rahul.sharma@pict.edu", "9876543210", "2003-03-15", 3],
    ["12101002", "Priya Singh", "priya.singh@pict.edu", "9876543211", "2003-06-20", 3],
    ["12101003", "Arjun Patel", "arjun.patel@pict.edu", "9876543212", "2003-01-10", 3],
    ["12101004", "Neha Gupta", "neha.gupta@pict.edu", "9876543213", "2004-05-25", 2],
    ["12101005", "Vikram Desai", "vikram.desai@pict.edu", "9876543214", "2004-08-12", 2],
    ["12101006", "Anjali Nair", "anjali.nair@pict.edu", "9876543215", "2004-02-18", 2],
    ["12101007", "Suresh Kumar", "suresh.kumar@pict.edu", "9876543216", "2005-07-22", 1],
    ["12101008", "Divya Sharma", "divya.sharma@pict.edu", "9876543217", "2005-11-30", 1],
    ["12101009", "Rohan Singh", "rohan.singh@pict.edu", "9876543218", "2005-04-14", 1],
    ["12101010", "Zara Khan", "zara.khan@pict.edu", "9876543219", "2005-09-08", 1],
]

# Add data rows
for row_idx, row_data in enumerate(sample_data, 2):
    for col_idx, value in enumerate(row_data, 1):
        cell = ws.cell(row=row_idx, column=col_idx)
        cell.value = value
        cell.alignment = openpyxl.styles.Alignment(horizontal="left", vertical="center")

# Adjust column widths
ws.column_dimensions['A'].width = 12
ws.column_dimensions['B'].width = 20
ws.column_dimensions['C'].width = 28
ws.column_dimensions['D'].width = 15
ws.column_dimensions['E'].width = 15
ws.column_dimensions['F'].width = 8

# Save the file
output_path = "sample_excel_files/students_bulk_upload.xlsx"
wb.save(output_path)

print(f"✅ Student Excel file created: {output_path}")
print("\nFormat:")
print("Column 1: RegNo (Registration number - Text)")
print("Column 2: Name (Student name - Text)")
print("Column 3: Email (Email address)")
print("Column 4: Mobile (10-digit mobile number)")
print("Column 5: DOB (Date of birth in YYYY-MM-DD format)")
print("Column 6: Year (Academic year: 1, 2, 3, or 4)")
print(f"\n✅ Sample data: {len(sample_data)} students added")
