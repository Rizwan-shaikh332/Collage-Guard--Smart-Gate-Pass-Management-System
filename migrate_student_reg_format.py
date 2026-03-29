import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# MongoDB connection
MONGODB_URL = "mongodb+srv://pict-guard:pict%40123@cluster0.bpfhkvc.mongodb.net/"
client = AsyncIOMotorClient(MONGODB_URL)
db = client["pict_guard_db"]

async def migrate_student_reg_format():
    """
    Migrate student registration numbers from PICT-20XX-XXX format to 8-digit PRN format
    
    Pattern to find: PICT-2022-001, PICT-2023-004, PICT-2024-006, etc.
    Pattern to create: 12101001, 12101002, 12101003, etc.
    """
    
    try:
        # Step 1: Find all students with PICT-20XX-XXX format
        pattern_regex = "^PICT-20[0-9]{2}-[0-9]{3}$"
        old_students = await db.students.find(
            {"reg_no": {"$regex": pattern_regex}},
            {"reg_no": 1, "name": 1, "_id": 0}
        ).to_list(None)
        
        print(f"Found {len(old_students)} students with old format (PICT-20XX-XXX)")
        
        if len(old_students) == 0:
            print("✅ No students found with old format. Migration complete.")
            return
        
        # Sort by reg_no to maintain consistency
        old_students.sort(key=lambda x: x['reg_no'])
        
        print("\nStudents to migrate:")
        print("-" * 60)
        for idx, student in enumerate(old_students, 1):
            print(f"{idx}. {student['reg_no']:15} → {student['name']}")
        
        # Step 2: Generate new 8-digit PRN numbers and update
        print("\n" + "="*60)
        print("MIGRATING RECORDS...")
        print("="*60)
        
        updated_count = 0
        errors = []
        
        for idx, student in enumerate(old_students, 1):
            old_reg = student['reg_no']
            new_reg = f"1210{idx:04d}"  # 12101001, 12101002, etc.
            
            try:
                # Check if new reg_no already exists
                existing = await db.students.find_one(
                    {"reg_no": new_reg},
                    {"_id": 0, "name": 1}
                )
                
                if existing and existing.get('name') != student['name']:
                    errors.append(f"⚠️  {new_reg} already exists for {existing.get('name')} (skipping {old_reg})")
                    continue
                
                # Update the student record
                result = await db.students.update_one(
                    {"reg_no": old_reg},
                    {"$set": {"reg_no": new_reg, "updated_at": datetime.now().isoformat()}}
                )
                
                if result.modified_count > 0:
                    print(f"✅ {idx}. {old_reg:15} → {new_reg}  ({student['name']})")
                    updated_count += 1
                else:
                    errors.append(f"❌ Failed to update {old_reg}")
                    
            except Exception as e:
                errors.append(f"❌ Error updating {old_reg}: {str(e)}")
                print(f"❌ {idx}. ERROR: {str(e)}")
        
        # Step 3: Summary and verification
        print("\n" + "="*60)
        print("MIGRATION SUMMARY")
        print("="*60)
        print(f"✅ Successfully updated: {updated_count}/{len(old_students)} students")
        
        if errors:
            print(f"\n⚠️  Errors/Warnings ({len(errors)}):")
            for error in errors:
                print(f"   {error}")
        
        # Step 4: Verify all records converted
        remaining_old = await db.students.count_documents(
            {"reg_no": {"$regex": pattern_regex}}
        )
        
        if remaining_old == 0:
            print(f"\n✅ VERIFICATION PASSED: All PICT-20XX-XXX format records converted!")
        else:
            print(f"\n⚠️  {remaining_old} records still have old format")
        
        # Show final count of 8-digit format
        new_format_count = await db.students.count_documents(
            {"reg_no": {"$regex": "^1210[0-9]{4}$"}}
        )
        print(f"✅ Total students with 8-digit PRN format: {new_format_count}")
        
        # List all students with new format
        print("\n" + "="*60)
        print("ALL STUDENTS WITH 8-DIGIT PRN FORMAT:")
        print("="*60)
        all_eight_digit = await db.students.find(
            {"reg_no": {"$regex": "^1210[0-9]{4}$"}},
            {"reg_no": 1, "name": 1, "_id": 0}
        ).to_list(None)
        
        for student in sorted(all_eight_digit, key=lambda x: x['reg_no']):
            print(f"  {student['reg_no']} - {student['name']}")
        
        print(f"\n✅ MIGRATION COMPLETE!")
        
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

# Run the migration
if __name__ == "__main__":
    print("🔄 Starting Student Registration Format Migration...")
    print(f"📅 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("="*60)
    
    asyncio.run(migrate_student_reg_format())
    
    print(f"\n📅 Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
