from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Models
class PractitionerRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    specialty: str
    phone: Optional[str] = None

class PractitionerLogin(BaseModel):
    email: EmailStr
    password: str

class Practitioner(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    full_name: str
    email: EmailStr
    specialty: str
    description: Optional[str] = ""
    phone: Optional[str] = ""
    schedule: Optional[str] = "Lun-Ven 9h-18h"
    address: Optional[str] = ""
    city: Optional[str] = ""
    photo_url: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PractitionerPublic(BaseModel):
    id: str
    full_name: str
    specialty: str
    description: str
    phone: str
    schedule: str
    address: str = ""
    city: str = ""
    photo_url: str

class PractitionerUpdate(BaseModel):
    full_name: Optional[str] = None
    specialty: Optional[str] = None
    description: Optional[str] = None
    phone: Optional[str] = None
    schedule: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    photo_url: Optional[str] = None

class Patient(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    practitioner_id: str
    full_name: str
    email: EmailStr
    phone: str
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PatientCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    notes: Optional[str] = ""

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    notes: Optional[str] = None

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    practitioner_id: str
    patient_id: str
    patient_name: str
    date: str  # YYYY-MM-DD
    time: str  # HH:MM
    duration: int = 60  # minutes
    notes: Optional[str] = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentCreate(BaseModel):
    patient_id: str
    patient_name: str
    date: str
    time: str
    duration: Optional[int] = 60
    notes: Optional[str] = ""

class TokenResponse(BaseModel):
    token: str
    practitioner: PractitionerPublic

class SearchQuery(BaseModel):
    specialty: Optional[str] = None
    city: Optional[str] = None

class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(practitioner_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": practitioner_id, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        practitioner_id = payload.get("sub")
        if not practitioner_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        practitioner = await db.practitioners.find_one({"id": practitioner_id}, {"_id": 0})
        if not practitioner:
            raise HTTPException(status_code=401, detail="User not found")
        return practitioner
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Auth routes
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(input: PractitionerRegister):
    # Check if email exists
    existing = await db.practitioners.find_one({"email": input.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create practitioner
    practitioner = Practitioner(
        full_name=input.full_name,
        email=input.email,
        specialty=input.specialty,
        phone=input.phone or ""
    )
    
    doc = practitioner.model_dump()
    doc['password'] = hash_password(input.password)
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.practitioners.insert_one(doc)
    
    token = create_token(practitioner.id)
    return TokenResponse(
        token=token,
        practitioner=PractitionerPublic(**practitioner.model_dump())
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(input: PractitionerLogin):
    practitioner = await db.practitioners.find_one({"email": input.email}, {"_id": 0})
    if not practitioner:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(input.password, practitioner['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(practitioner['id'])
    return TokenResponse(
        token=token,
        practitioner=PractitionerPublic(**practitioner)
    )

# Public routes
@api_router.get("/public/practitioners", response_model=List[PractitionerPublic])
async def search_practitioners(specialty: Optional[str] = None, city: Optional[str] = None):
    query = {}
    if specialty:
        query['specialty'] = {"$regex": specialty, "$options": "i"}
    if city:
        query['city'] = {"$regex": city, "$options": "i"}
    
    practitioners = await db.practitioners.find(query, {"_id": 0, "password": 0}).to_list(100)
    return [PractitionerPublic(**p) for p in practitioners]

@api_router.get("/public/practitioner/{practitioner_id}", response_model=PractitionerPublic)
async def get_public_practitioner(practitioner_id: str):
    practitioner = await db.practitioners.find_one({"id": practitioner_id}, {"_id": 0, "password": 0})
    if not practitioner:
        raise HTTPException(status_code=404, detail="Practitioner not found")
    return PractitionerPublic(**practitioner)

@api_router.post("/contact")
async def submit_contact(input: ContactMessageCreate):
    contact_message = ContactMessage(
        name=input.name,
        email=input.email,
        message=input.message
    )
    
    doc = contact_message.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.contact_messages.insert_one(doc)
    
    # Here you could also send an email notification
    # For now, we just store it in the database
    
    return {"message": "Message received successfully", "id": contact_message.id}

# Protected routes - Practitioner
@api_router.get("/practitioner/profile", response_model=Practitioner)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return Practitioner(**current_user)

@api_router.put("/practitioner/profile", response_model=Practitioner)
async def update_profile(input: PractitionerUpdate, current_user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    
    if update_data:
        await db.practitioners.update_one(
            {"id": current_user['id']},
            {"$set": update_data}
        )
    
    updated = await db.practitioners.find_one({"id": current_user['id']}, {"_id": 0})
    return Practitioner(**updated)

# Protected routes - Patients
@api_router.get("/patients", response_model=List[Patient])
async def get_patients(current_user: dict = Depends(get_current_user)):
    patients = await db.patients.find(
        {"practitioner_id": current_user['id']},
        {"_id": 0}
    ).to_list(1000)
    
    for patient in patients:
        if isinstance(patient.get('created_at'), str):
            patient['created_at'] = datetime.fromisoformat(patient['created_at'])
    
    return patients

@api_router.post("/patients", response_model=Patient)
async def create_patient(input: PatientCreate, current_user: dict = Depends(get_current_user)):
    patient = Patient(
        practitioner_id=current_user['id'],
        full_name=input.full_name,
        email=input.email,
        phone=input.phone,
        notes=input.notes or ""
    )
    
    doc = patient.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.patients.insert_one(doc)
    return patient

@api_router.put("/patients/{patient_id}", response_model=Patient)
async def update_patient(patient_id: str, input: PatientUpdate, current_user: dict = Depends(get_current_user)):
    # Verify patient belongs to current user
    patient = await db.patients.find_one({"id": patient_id, "practitioner_id": current_user['id']}, {"_id": 0})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    update_data = {k: v for k, v in input.model_dump().items() if v is not None}
    
    if update_data:
        await db.patients.update_one(
            {"id": patient_id},
            {"$set": update_data}
        )
    
    updated = await db.patients.find_one({"id": patient_id}, {"_id": 0})
    if isinstance(updated.get('created_at'), str):
        updated['created_at'] = datetime.fromisoformat(updated['created_at'])
    
    return Patient(**updated)

@api_router.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.patients.delete_one({
        "id": patient_id,
        "practitioner_id": current_user['id']
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    return {"message": "Patient deleted"}

# Protected routes - Appointments
@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments(current_user: dict = Depends(get_current_user)):
    appointments = await db.appointments.find(
        {"practitioner_id": current_user['id']},
        {"_id": 0}
    ).to_list(1000)
    
    for apt in appointments:
        if isinstance(apt.get('created_at'), str):
            apt['created_at'] = datetime.fromisoformat(apt['created_at'])
    
    return appointments

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(input: AppointmentCreate, current_user: dict = Depends(get_current_user)):
    appointment = Appointment(
        practitioner_id=current_user['id'],
        patient_id=input.patient_id,
        patient_name=input.patient_name,
        date=input.date,
        time=input.time,
        duration=input.duration or 60,
        notes=input.notes or ""
    )
    
    doc = appointment.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.appointments.insert_one(doc)
    return appointment

@api_router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.appointments.delete_one({
        "id": appointment_id,
        "practitioner_id": current_user['id']
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    return {"message": "Appointment deleted"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()