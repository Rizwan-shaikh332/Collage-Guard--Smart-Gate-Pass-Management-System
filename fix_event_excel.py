import openpyxl
from openpyxl.styles import Font, PatternFill

# Create a new workbook
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Event Students"

# Define headers - Option 1: Just RegNo (for existing students)
headers = ["RegNo"]

# Add header row with formatting
header_fill = PatternFill(start_color="366092", end_color="366092", fill_type="solid")
header_font = Font(color="FFFFFF", bold=True)

for col, header in enumerate(headers, 1):
    cell = ws.cell(row=1, column=col)
    cell.value = header
    cell.fill = header_fill
    cell.font = header_font

# Add note row
note_cell = ws.cell(row=2, column=1)
note_cell.value = "=== Method 1: For Registered Students (Use RegNo) ==="
note_cell.font = Font(italic=True, color="666666")

# Sample data for registered students
sample_data_1 = [
    ["12101001"],
    ["12101002"],
    ["12101003"],
    ["12101004"],
    ["12101005"],
]

# Add data rows
row_num = 3
for row_data in sample_data_1:
    for col_idx, value in enumerate(row_data, 1):
        cell = ws.cell(row=row_num, column=col_idx)
        cell.value = value
        cell.alignment = openpyxl.styles.Alignment(horizontal="left", vertical="center")
    row_num += 1

# Add separator and alternative method
separator_row = row_num + 1
sep_cell = ws.cell(row=separator_row, column=1)
sep_cell.value = ""

method2_row = separator_row + 1
method2_cell = ws.cell(row=method2_row, column=1)
method2_cell.value = "=== Method 2: For External/Non-Registered Students ==="
method2_cell.font = Font(italic=True, color="666666")

# Add headers for method 2
headers_2 = ["RegNo", "Name", "Email", "Mobile"]
header2_row = method2_row + 1
for col, header in enumerate(headers_2, 1):
    cell = ws.cell(row=header2_row, column=col)
    cell.value = header
    cell.fill = PatternFill(start_color="D3D3D3", end_color="D3D3D3", fill_type="solid")
    cell.font = Font(bold=True)

# Sample data for external students
sample_data_2 = [
    ["EXT001", "External Student 1", "external1@example.com", "9876543220"],
    ["EXT002", "External Student 2", "external2@example.com", "9876543221"],
]

# Add data rows for method 2
row_num = header2_row + 1
for row_data in sample_data_2:
    for col_idx, value in enumerate(row_data, 1):
        cell = ws.cell(row=row_num, column=col_idx)
        cell.value = value
        cell.alignment = openpyxl.styles.Alignment(horizontal="left", vertical="center")
    row_num += 1

# Adjust column widths
ws.column_dimensions['A'].width = 20
ws.column_dimensions['B'].width = 25
ws.column_dimensions['C'].width = 30
ws.column_dimensions['D'].width = 15

# Save the file
output_path = "sample_excel_files/event_students_bulk_upload.xlsx"
wb.save(output_path)

print(f"✅ Event Students Excel file created: {output_path}")
print("\n📋 Two Methods Available:")
print("\n1️⃣  METHOD 1: For Registered Students")
print("   Column 1: RegNo (Must exist in system)")
print("   Example: 12101001")
print("\n2️⃣  METHOD 2: For External/Non-Registered Students")
print("   Column 1: RegNo (Any identifier)")
print("   Column 2: Name (Full name)")
print("   Column 3: Email (Email address)")
print("   Column 4: Mobile (10-digit number)")
print("\n✅ Sample data provided for both methods")
