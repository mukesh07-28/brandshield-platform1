from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.company import Company
from app.schemas.company import CompanyCreate, CompanyResponse

router = APIRouter(
    prefix="/companies",
    tags=["Companies"]
)


@router.post("/", response_model=CompanyResponse)
def create_company(
    company: CompanyCreate,
    db: Session = Depends(get_db)
):
    new_company = Company(
        name=company.name,
        website=company.website,
        logo_url=company.logo_url,
        description=company.description
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)

    return new_company

@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(
    company_id: int,
    db: Session = Depends(get_db)
):
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company
