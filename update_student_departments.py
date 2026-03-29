"""
Script to populate missing departments for existing students in the database.
This script updates students that don't have a department assigned.
"""

import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / 'backend' / '.env')

# MongoDB connection
MONGO_URL = os.getenv('MONGO_URL')
DB_NAME = os.getenv('DB_NAME')

# Department assignment based on student name patterns or random assignment
DEPARTMENTS = [
    "Computer Engineering",
    "Information Technology",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Electrical Engineering"
]

# Mapping of email domains to departments (you can customize this)
DEPARTMENT_MAPPING = {
    "comps": "Computer Engineering",
    "it": "Information Technology",
    "extc": "Electronics Engineering",
    "mech": "Mechanical Engineering",
    "civil": "Civil Engineering",
    "etrx": "Electrical Engineering",
}

async def update_student_departments():
    """Update students with missing departments"""
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    students_collection = db["students"]
    
    try:
        # Find students with empty or missing department
        empty_dept_students = await students_collection.find({
            "$or": [
                {"department": ""},
                {"department": None},
                {"department": {"$exists": False}}
            ]
        }).to_list(None)
        
        print(f"\n📊 Found {len(empty_dept_students)} students with missing departments")
        
        if len(empty_dept_students) == 0:
            print("✅ All students have departments assigned!")
            return
        
        print("\n🔄 Updating departments...\n")
        
        updated_count = 0
        
        for student in empty_dept_students:
            email = student.get("email", "").lower()
            assigned_dept = None
            
            # Try to match department from email
            for keyword, dept in DEPARTMENT_MAPPING.items():
                if keyword in email:
                    assigned_dept = dept
                    break
            
            # If no match, display and ask for manual assignment
            if not assigned_dept:
                print(f"Student: {student.get('name')} (Reg: {student.get('reg_no')})")
                print(f"Email: {email}")
                
                # Show department options
                for i, dept in enumerate(DEPARTMENTS, 1):
                    print(f"  {i}. {dept}")
                
                try:
                    choice = input("Select department (1-6) or press Enter to skip: ").strip()
                    if choice and choice.isdigit() and 1 <= int(choice) <= 6:
                        assigned_dept = DEPARTMENTS[int(choice) - 1]
                    else:
                        print("⏭️  Skipped\n")
                        continue
                except KeyboardInterrupt:
                    print("\n❌ Update cancelled by user")
                    return
            
            # Update the student in database
            if assigned_dept:
                result = await students_collection.update_one(
                    {"_id": student["_id"]},
                    {"$set": {"department": assigned_dept}}
                )
                
                if result.modified_count > 0:
                    print(f"✅ {student.get('name'):<25} → {assigned_dept}")
                    updated_count += 1
                else:
                    print(f"⚠️  Update failed for {student.get('name')}")
                
                print()
        
        print(f"\n✅ Successfully updated {updated_count} students with departments!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        
    finally:
        client.close()

if __name__ == "__main__":
    print("""
╔════════════════════════════════════════════════════════════╗
║   PICT Guard - Student Department Update Script           ║
║   Update missing department information for students      ║
╚════════════════════════════════════════════════════════════╝
    """)
    
    asyncio.run(update_student_departments())
