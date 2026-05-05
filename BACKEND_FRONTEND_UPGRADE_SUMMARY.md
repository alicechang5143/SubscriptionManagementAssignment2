# Assessment 2 Application Upgrade Summary

This upgraded Subscription Management System includes:

## Backend improvements
- OOP-based service layer: AuthService, PlanService, SubscriptionService
- Repository pattern: BaseRepository, PlanRepository, UserRepository, SubscriptionRepository
- Factory pattern: ApiResponseFactory
- Strategy pattern: MonthlyPricingStrategy and YearlyPricingStrategy
- Observer pattern: SubscriptionEventManager and AuditLogObserver
- Singleton pattern: DatabaseConnection
- Middleware pattern: authentication, admin protection, and centralized error handling
- Health endpoint for ALB traffic proof: GET /api/health
- Subscription lifecycle endpoints: create, fetch, update, cancel, renew, delete
- Admin plan CRUD endpoints
- Functional backend tests under backend/tests

## Frontend improvements
- Replaced Assessment-1 task wording with subscription wording
- Added user subscription lifecycle UI
- Added admin create/update/delete/activate/deactivate plan UI
- Updated axios handling for standard API response wrapper
- Added production-ready API base URL support via REACT_APP_API_URL

## Main commands
Backend:
cd backend
npm install
npm test
npm start

Frontend:
cd frontend
npm install
npm run build
npm start

## Demo notes
- Use /api/health for ALB distribution screenshots.
- Use admin login to create subscription plans.
- Use normal user login to subscribe, renew, cancel, and delete subscription records.
