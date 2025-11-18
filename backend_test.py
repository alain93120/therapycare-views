import requests
import sys
import json
from datetime import datetime

class TherapyCareAPITester:
    def __init__(self, base_url="https://care-providers.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.practitioner_id = None
        self.patient_id = None
        self.appointment_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": name,
            "status": "PASS" if success else "FAIL",
            "details": details
        }
        self.test_results.append(result)
        
        status_icon = "✅" if success else "❌"
        print(f"{status_icon} {name}: {details}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    self.log_test(name, True, f"Status: {response.status_code}")
                    return True, response_data
                except:
                    self.log_test(name, True, f"Status: {response.status_code} (No JSON)")
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}: {error_data}")
                except:
                    self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}")
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Error: {str(e)}")
            return False, {}

    def test_practitioner_registration(self):
        """Test practitioner registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_data = {
            "full_name": f"Dr. Test Practitioner {timestamp}",
            "email": f"test.practitioner.{timestamp}@example.com",
            "specialty": "Psychologue",
            "password": "TestPassword123!",
            "phone": "+33 6 12 34 56 78"
        }
        
        success, response = self.run_test(
            "Practitioner Registration",
            "POST",
            "auth/register",
            200,
            data=test_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.practitioner_id = response['practitioner']['id']
            return True
        return False

    def test_practitioner_login(self):
        """Test practitioner login with existing credentials"""
        # First register a user for login test
        timestamp = datetime.now().strftime('%H%M%S')
        register_data = {
            "full_name": f"Dr. Login Test {timestamp}",
            "email": f"login.test.{timestamp}@example.com",
            "specialty": "Psychiatre",
            "password": "LoginTest123!",
            "phone": "+33 6 98 76 54 32"
        }
        
        # Register first
        success, _ = self.run_test(
            "Pre-register for Login Test",
            "POST",
            "auth/register",
            200,
            data=register_data
        )
        
        if not success:
            return False
        
        # Now test login
        login_data = {
            "email": register_data["email"],
            "password": register_data["password"]
        }
        
        success, response = self.run_test(
            "Practitioner Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        return success and 'token' in response

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_data = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        success, _ = self.run_test(
            "Invalid Login (Should Fail)",
            "POST",
            "auth/login",
            401,
            data=invalid_data
        )
        
        return success  # Success means we got the expected 401

    def test_duplicate_registration(self):
        """Test registration with duplicate email"""
        if not self.token:
            return False
            
        # Try to register with same email again
        duplicate_data = {
            "full_name": "Dr. Duplicate Test",
            "email": f"test.practitioner.{datetime.now().strftime('%H%M%S')}@example.com",
            "specialty": "Psychologue",
            "password": "TestPassword123!"
        }
        
        # First registration
        self.run_test("First Registration", "POST", "auth/register", 200, data=duplicate_data)
        
        # Duplicate registration should fail
        success, _ = self.run_test(
            "Duplicate Registration (Should Fail)",
            "POST",
            "auth/register",
            400,
            data=duplicate_data
        )
        
        return success

    def test_get_profile(self):
        """Test getting practitioner profile"""
        if not self.token:
            return False
            
        success, response = self.run_test(
            "Get Practitioner Profile",
            "GET",
            "practitioner/profile",
            200
        )
        
        return success and 'full_name' in response

    def test_update_profile(self):
        """Test updating practitioner profile"""
        if not self.token:
            return False
            
        update_data = {
            "description": "Spécialisé en thérapie cognitive comportementale",
            "schedule": "Lun-Ven 8h-19h, Sam 9h-13h"
        }
        
        success, response = self.run_test(
            "Update Practitioner Profile",
            "PUT",
            "practitioner/profile",
            200,
            data=update_data
        )
        
        return success and response.get('description') == update_data['description']

    def test_public_profile(self):
        """Test getting public practitioner profile"""
        if not self.practitioner_id:
            return False
            
        success, response = self.run_test(
            "Get Public Practitioner Profile",
            "GET",
            f"public/practitioner/{self.practitioner_id}",
            200
        )
        
        return success and 'full_name' in response

    def test_invalid_public_profile(self):
        """Test getting non-existent public profile"""
        success, _ = self.run_test(
            "Get Invalid Public Profile (Should Fail)",
            "GET",
            "public/practitioner/invalid-id",
            404
        )
        
        return success

    def test_create_patient(self):
        """Test creating a patient"""
        if not self.token:
            return False
            
        timestamp = datetime.now().strftime('%H%M%S')
        patient_data = {
            "full_name": f"Jean Martin {timestamp}",
            "email": f"jean.martin.{timestamp}@example.com",
            "phone": "+33 6 11 22 33 44"
        }
        
        success, response = self.run_test(
            "Create Patient",
            "POST",
            "patients",
            200,
            data=patient_data
        )
        
        if success and 'id' in response:
            self.patient_id = response['id']
            return True
        return False

    def test_get_patients(self):
        """Test getting patients list"""
        if not self.token:
            return False
            
        success, response = self.run_test(
            "Get Patients List",
            "GET",
            "patients",
            200
        )
        
        return success and isinstance(response, list)

    def test_create_appointment(self):
        """Test creating an appointment"""
        if not self.token or not self.patient_id:
            return False
            
        appointment_data = {
            "patient_id": self.patient_id,
            "patient_name": "Jean Martin Test",
            "date": "2024-12-25",
            "time": "14:30",
            "duration": 60,
            "notes": "Première consultation"
        }
        
        success, response = self.run_test(
            "Create Appointment",
            "POST",
            "appointments",
            200,
            data=appointment_data
        )
        
        if success and 'id' in response:
            self.appointment_id = response['id']
            return True
        return False

    def test_get_appointments(self):
        """Test getting appointments list"""
        if not self.token:
            return False
            
        success, response = self.run_test(
            "Get Appointments List",
            "GET",
            "appointments",
            200
        )
        
        return success and isinstance(response, list)

    def test_delete_appointment(self):
        """Test deleting an appointment"""
        if not self.token or not self.appointment_id:
            return False
            
        success, _ = self.run_test(
            "Delete Appointment",
            "DELETE",
            f"appointments/{self.appointment_id}",
            200
        )
        
        return success

    def test_unauthorized_access(self):
        """Test accessing protected routes without token"""
        # Temporarily remove token
        original_token = self.token
        self.token = None
        
        success, _ = self.run_test(
            "Unauthorized Access (Should Fail)",
            "GET",
            "practitioner/profile",
            401
        )
        
        # Restore token
        self.token = original_token
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting TherapyCare API Tests...")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Authentication tests
        print("\n📝 Authentication Tests:")
        self.test_practitioner_registration()
        self.test_practitioner_login()
        self.test_invalid_login()
        self.test_duplicate_registration()
        self.test_unauthorized_access()
        
        # Profile tests
        print("\n👤 Profile Tests:")
        self.test_get_profile()
        self.test_update_profile()
        self.test_public_profile()
        self.test_invalid_public_profile()
        
        # Patient tests
        print("\n🏥 Patient Tests:")
        self.test_create_patient()
        self.test_get_patients()
        
        # Appointment tests
        print("\n📅 Appointment Tests:")
        self.test_create_appointment()
        self.test_get_appointments()
        self.test_delete_appointment()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"❌ {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = TherapyCareAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())